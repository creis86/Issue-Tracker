const { MongoClient } = require("mongodb");

const url = "mongodb+srv://casreis:creis86@cluster0.hpr0d.mongodb.net/issuetracker?retryWrites=true&w=majority";

function testWithCallbacks(callback) {
    console.log("\n--- testWithCallbacks ---");
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect((connError, client) => {
        if(connError) {
            client.close();
            callback(connError);
            return;
        }
        console.log("Connected to MongoDB");
        const db = client.db();
        const employees = db.collection("employees");

        const employee = { id: 1, name: "A. Callback", age: 23 };
        employees.insertOne(employee, (insertError, result) => {
            if(insertError) {
                client.close();
                callback(insertError);
                return;
            }
            console.log("Result of insert:\n", result.insertedId);
            employees.find({ _id: result.insertedId })
                .toArray((findError, docs) => {
                    if(findError) {
                        client.close();
                        callback(findError);
                        return;
                    }
                    console.log("Result of find:\n", docs);
                    client.close();
                    callback();
                });
        });
    });
}

async function testWithAsync() {
    console.log("\n--- testWithAsync ---");
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db();
        const employees = db.collection("employees");

        const employee = { id: 2, name: "B. Async", age: 16 };
        const result = await employees.insertOne(employee);
        console.log("Result of insert:\n", result.insertedId);
        const docs = await employees.find({ _id: result.insertedId }).toArray();
        console.log("Result of find:\n", docs);
    } catch(error) {
        console.log(error);
    } finally {
        client.close();
    }
}

testWithCallbacks(error => {
    if(error) console.log(error);
    testWithAsync();
});
