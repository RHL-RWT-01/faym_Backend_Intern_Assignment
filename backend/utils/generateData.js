import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import Event from '../models/eventModel.js';

dotenv.config();

const EVENT_TYPES = ['view', 'click', 'location'];
const USERS = Array.from({ length: 100 }, () => faker.string.uuid());

const generateRandomDate = () => {
  const start = new Date('2025-05-01').getTime();
  const end = new Date('2025-05-29').getTime();
  return new Date(start + Math.random() * (end - start));
};

const generatePayload = (type) => {
  switch (type) {
    case 'view':
      return {
        url: faker.internet.url(),
        title: faker.lorem.sentence(),
      };
    case 'click':
      return {
        element_id: faker.string.uuid(),
        text: faker.lorem.words(2),
        xpath: `/html/body/div[${faker.number.int({ min: 1, max: 10 })}]/button[1]`,
      };
    case 'location':
      return {
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        accuracy: faker.number.int({ min: 5, max: 100 }),
      };
    default:
      return {};
  }
};

export const generateEvents = async (count = 3000) => {
  const events = Array.from({ length: count }, () => {
    const event_type = faker.helpers.arrayElement(EVENT_TYPES);
    return {
      user_id: faker.helpers.arrayElement(USERS),
      event_type,
      payload: generatePayload(event_type),
      timestamp: generateRandomDate(),
    };
  });

  await Event.insertMany(events);
  console.log(`${events.length} sample events inserted.`);
};
