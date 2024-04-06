import { ShardingManager } from "discord.js";
import config from "./config";
import express from "express";

const manager = new ShardingManager(`${__dirname}/index.js`, {
  totalShards: "auto",
  shardList: "auto",
  mode: "process",
  token: config.DISCORD_TOKEN,
});

const app = express();
const port = process.env.PORT || 8080;

manager.on("shardCreate", (shard) => {
  console.log(`Launched shard ${shard.id}`);
});

app.get("/", (req, res) => {
  res.send("Server started with typescript.");
});

try {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
} catch (error) {
  console.log(error);
}

manager.spawn({ timeout: -1 });
