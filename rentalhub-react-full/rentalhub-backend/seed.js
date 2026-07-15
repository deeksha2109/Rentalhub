require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Ride = require('./models/Ride'); // Points to "cars" collection

const newFleetCars = [
  {
    name: 'Luxury Sedan (BMW 5 Series)',
    description: 'Comfortable, quiet, and stylish. Perfect for corporate travel, executive commutes, or premium city tours.',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=600',
    category: 'luxury',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    features: ['GPS Navigation', 'Leather Seats', 'Heated Steering Wheel'],
    available: true,
    active: true,
  },
  {
    name: 'Family SUV (Audi Q7)',
    description: 'Extremely spacious and perfect for weekend family vacations, mountain getaways, or cross-country road trips.',
    price: 5500,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600',
    category: 'suv',
    seats: 7,
    transmission: 'Automatic',
    fuel: 'Diesel',
    features: ['4WD', 'Panoramic Sunroof', 'Third Row Seating'],
    available: true,
    active: true,
  },
  {
    name: 'Exotic Convertible (Ford Mustang)',
    description: 'Experience top-down open-air freedom. Sleek design combined with raw American muscle power.',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=600',
    category: 'sports',
    seats: 4,
    transmission: 'Automatic',
    fuel: 'Petrol',
    features: ['V8 Engine', 'Leather Interior', 'Apple CarPlay'],
    available: true,
    active: true,
  },
  {
    name: 'Super Sports (Porsche 911)',
    description: 'Precision handling and exhilarating acceleration. Made for enthusiasts seeking peak driving performance.',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=600',
    category: 'sports',
    seats: 2,
    transmission: 'Automatic',
    fuel: 'Petrol',
    features: ['Launch Control', 'Sport Chrono Package', 'Active Suspension'],
    available: true,
    active: true,
  },
  {
    name: 'Premium Electric (Tesla Model Y)',
    description: 'Eco-friendly premium travel. High range, cutting-edge self-driving features, and an silent ride.',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=600',
    category: 'luxury',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Electric',
    features: ['Autopilot', 'All-Glass Roof', 'Supercharger Network'],
    available: true,
    active: true,
  },
  {
    name: 'Urban Hatchback (Mini Cooper)',
    description: 'Agile, compact, and fun to drive. Easy to park and perfect for squeezing through busy city streets.',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=600',
    category: 'compact',
    seats: 4,
    transmission: 'Automatic',
    fuel: 'Petrol',
    features: ['Harman Kardon Audio', 'Mini HUD', 'Ambient Lighting'],
    available: true,
    active: true,
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to database for merging fleet into cars...');

    // Instead of deleteMany(), we insert only if they don't already exist in "cars"
    let addedCount = 0;
    for (const car of newFleetCars) {
      const exists = await Ride.findOne({ name: car.name });
      if (!exists) {
        await Ride.create(car);
        console.log(`Added: ${car.name}`);
        addedCount++;
      } else {
        console.log(`Already exists (skipped): ${car.name}`);
      }
    }
    console.log(`Finished adding fleet cars. Total new additions: ${addedCount}`);

    // Seed default admin if not exists
    const adminExists = await User.findOne({ email: 'admin@yourcompany.com' });
    if (!adminExists) {
      await User.create({
        name: 'System Admin',
        email: 'admin@yourcompany.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Default admin created successfully (admin@yourcompany.com / admin123).');
    } else {
      console.log('Admin account already exists.');
    }

    console.log('Database merge complete. Closing connection...');
    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
