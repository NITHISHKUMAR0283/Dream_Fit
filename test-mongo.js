const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://dbuser:ASNRangusumathi%402006@dreamfit-cluster.wonstkw.mongodb.net/?retryWrites=true&w=majority&appName=DreamFit-Cluster";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    console.log('Attempting to connect to MongoDB...');
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);