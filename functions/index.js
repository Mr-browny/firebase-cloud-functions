const functions = require('firebase-functions');
const admin = require('firebase-admin')

admin.initializeApp();
 

// Auth trigger (new User Signup)
exports.newUserSignup = functions.auth.user().onCreate(user => {
    return admin
    .firestore()
    .collection('users')
    .doc(user.uid)
    .set({
        email: user.email,
        upvotedOn: [],
        verifiedEmail: user.emailVerified
    })
});

// Auth trigger (user Deleted)
exports.userDeleted = functions.auth.user().onDelete(user => {
    const doc = admin.firestore().collection('users').doc(user.uid)
    return doc.delete();
});

// Http callable function for adding tutorial request
exports.addRequest = functions.https.onCall( (data, context) => {
    if (!context.auth) {
        // to throw an error in firebase, use the new functions with the HttpsError instance, which allows two arguments,
        // the first being the error type (found on the official firebase docs) and the second, additions error message.
        throw new functions.https.HttpsError('unauthenticated', 'Only authenticated users fit add Request bro')
    }
    if (data.text.length > 30) {
        throw new functions.https.HttpsError('invalid-argument', 'Request must be no more than 30 chars long')
    }

   return admin
    .firestore()
    .collection('request')
    .add({
        text: data.text,
        upvotes: 0
    })
});

//  Funtction to handle the upvoting
exports.upvote = functions.https.onCall( async (data, context) =>{
    // Checking if user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Only authenticated users can upvote')
    }

    // Grabbing the user and the request's Id
    const user = admin.firestore().collection('users').doc(context.auth.uid)
    const request = admin.firestore().collection('request').doc(data.id)

    // Checking if user has upvoted before
    const doc = await user.get()
    if (doc.data().upvotedOn.includes(data.id)) { 
        throw new functions.https.HttpsError('failed-precondition', `You can only Upvote ${data.text} once`)
    }

        // Update the user upvoted array
        await user.update({
            upvotedOn: [...doc.data().upvotedOn, data.id]
        })
        // Update votes on the request
        await request.update({
            upvotes: admin.firestore.FieldValue.increment(1)
        })
});
 

// Firestore Trigger for tracking activities
// the { } serves as a wild card, which would contain any type of collection  and Id, we could use any name of our choice though
exports.logActivities = functions.firestore.document('/{collection}/{id}').onCreate((snap, context) => {
    // the snap contains the data created, while the context is info of the path created
    console.log(snap.data())
    const collection = context.params.collection
    const id = context.params.id;

    // Creating the activity collection
    const activities = admin.firestore().collection('activities');

    return collection === 'request' ? 
    activities.add( {
        text: 'A new tutorial request was added'
    }) : 
    collection === 'users' ? 
    activities.add( {
        text: 'A new user just signed up'
    }) : 
    null
})