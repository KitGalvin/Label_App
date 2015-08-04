Labels = new Mongo.Collection('labels');

if (Meteor.isServer) {
  Meteor.publish('someLabels', function() {
    return Labels.find();
  } );
}
