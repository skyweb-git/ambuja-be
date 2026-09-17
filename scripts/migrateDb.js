import mongoose from 'mongoose';

const OLD_URI = 'mongodb+srv://inch34915_db_user:CYH6kIVgo3CB8jZN@cluster0.7wkvbg0.mongodb.net/maytri_crm?appName=Cluster0';
const NEW_URI = 'mongodb+srv://inchinchwebsupport_db_user:dgIA99od0uSEqbYK@ambujabackend.biwsofh.mongodb.net/maytri_crm?retryWrites=true&w=majority&appName=ambujabackend';

async function migrate() {
  console.log('Connecting to current source DB (Cluster0)...');
  const oldConn = await mongoose.createConnection(OLD_URI, {
    serverSelectionTimeoutMS: 10000,
  }).asPromise();
  console.log('✅ Connected to current source DB');

  console.log('Connecting to new target DB (ambujabackend)...');
  const newConn = await mongoose.createConnection(NEW_URI, {
    serverSelectionTimeoutMS: 10000,
  }).asPromise();
  console.log('✅ Connected to new target DB');

  const collections = await oldConn.db.listCollections().toArray();
  console.log('Found collections in source DB:', collections.map(c => c.name));

  for (const col of collections) {
    const colName = col.name;
    if (colName.startsWith('system.')) continue;

    const oldCollection = oldConn.db.collection(colName);
    const newCollection = newConn.db.collection(colName);

    const docs = await oldCollection.find({}).toArray();
    console.log(`Migrating ${docs.length} docs from collection: ${colName}`);

    if (docs.length > 0) {
      await newCollection.deleteMany({});
      await newCollection.insertMany(docs);
      console.log(`✅ Successfully copied ${docs.length} docs into ${colName}`);
    } else {
      console.log(`ℹ️ Collection ${colName} is empty, skipping document insert.`);
    }
  }

  // Verification step
  console.log('\n--- VERIFYING TARGET DATABASE ---');
  const newCollections = await newConn.db.listCollections().toArray();
  for (const col of newCollections) {
    const colName = col.name;
    if (colName.startsWith('system.')) continue;
    const count = await newConn.db.collection(colName).countDocuments();
    console.log(`Target collection [${colName}]: ${count} documents`);
  }

  console.log('🎉 Migration completed successfully!');
  await oldConn.close();
  await newConn.close();
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ Migration Error:', err);
  process.exit(1);
});
