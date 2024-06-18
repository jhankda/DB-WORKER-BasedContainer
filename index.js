import connectDB from "./db/index.js";
import dotenv from 'dotenv';
import { createClient,  } from 'redis';
import { creation } from "./src/index.js";

dotenv.config({
    path: './env'
});
connectDB();


const client = createClient();

async function DBPickup() {
    // await client.connect();
    try {
        await client.connect();
        // console.log(client)
        console.log("\n DB ALPHA IS Connected to the Q");
        while (true) {
            console.log("again waiting for the data")
            const parsedata = await client.brPop('Submissions', 0)

            const data = JSON.parse(parsedata.element);
            console.log(`\n DB ALPHA is processing the data: ${data}`);


            try {
                let result;
                switch (data.Action) {
                    case "CREATE":
                        result = await creation(data);
                        break;
                    default:
                        console.log("Invalid action");
                        result = "Invalid action";
                        throw error("Invalid action");
                        break;
                }
                const operationId = data.operationId


                console.log(`\n DB ALPHA has processed the data: ${JSON.stringify(data)}`);
                client.lPush('Results', JSON.stringify({ operationId, result }));
            } catch (error) {
                console.error('Error processing the data', error);
                client.lPush('Results', JSON.stringify({ operationId, error: error.message }));
            }
        } 
    } catch (err) {
        console.error('Error in DBPickup function', err);
    }
}

DBPickup().catch((err) => {
    console.error('Error starting DBPickup function', err);
});

process.on('SIGTERM', async () => {
    client.quit();
    console.log('Gracefully shut down');
    process.exit(0);
});
