import axios from "axios";

const askDought = async (req, res, next) => {
  const { message } = req.body;
  const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
    process.env.GOOGLE_API;

  try {
    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          parts: [{ text: message }],
        },
      ],
    });

    const answer = response.data.candidates[0].content.parts[0].text;
    res.json({ answer });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export { askDought };
