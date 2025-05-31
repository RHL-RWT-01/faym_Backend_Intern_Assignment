const { Schema } = mongoose;
import mongoose from 'mongoose';

const baseOptions = {
  discriminatorKey: 'event_type',
  collection: 'events',
  timestamps: { createdAt: 'timestamp', updatedAt: false },
};

const EventSchema = new Schema({
  user_id: { type: String, required: true },
}, baseOptions);

const Event = mongoose.model('Event', EventSchema);

const ViewEvent = Event.discriminator('view', new Schema({
  payload: {
    url: { type: String, required: true },
    title: { type: String },
  },
}));

const ClickEvent = Event.discriminator('click', new Schema({
  payload: {
    element_id: { type: String },
    text: { type: String },
    xpath: { type: String },
  },
}));

const LocationEvent = Event.discriminator('location', new Schema({
  payload: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    accuracy: { type: Number },
  },
}));

export default Event;
