const express = require("express");
const router = express.Router();
const { openai } = require("../clients");

router.post("/chat", async (req, res) => {
  try {
    const { message, thread_id } = req.body;

    let threadId;
    if (thread_id) {
      threadId = thread_id;
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: message,
      });
    } else {
      const newThread = await openai.beta.threads.create({
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      });
      threadId = newThread.id;
    }

    // Create a run with the thread id and the assistant id
    // Remember to create the assistant in the openAI dashboard

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID,
      tools: [{ type: "retrieval" }],
    });

    // Wait for the completed status to be returned from the run (Poll every 5 seconds)

    let completed = false;
    while (!completed) {
      await sleep(5000);
      const asstRun = await openai.beta.threads.runs.retrieve(threadId, run.id);
      completed = asstRun.status === "completed";
      console.log("run status:", asstRun.status);
    }

    // Get the messages from the thread
    const messages = await openai.beta.threads.messages.list(threadId);
    const lastMessage = messages.data[0];

    return res.json({
      threadId,
      response: lastMessage.content[0].text.value,
    });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .send(error.msg || `An error occurred: Please try again later.`);
  }
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = router;
