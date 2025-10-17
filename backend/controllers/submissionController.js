const axios = require('axios');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

exports.submitToJudge0 = async (req, res) => {
  try {
    const { sourceCode, languageId, stdin } = req.body;
    if (!sourceCode || !languageId) return res.status(400).json({ message: 'Missing fields' });

    const baseUrl = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com/submissions';
    const apiKey = process.env.JUDGE0_API_KEY;

    const createRes = await axios.post(
      `${baseUrl}?base64_encoded=false&wait=false`,
      {
        source_code: sourceCode,
        language_id: languageId,
        stdin: stdin || '',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey
            ? { 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com' }
            : {}),
        },
      }
    );

    const token = createRes.data.token;
    let result = null;

    for (let i = 0; i < 20; i++) {
      const getRes = await axios.get(`${baseUrl}/${token}`, {
        headers: {
          ...(apiKey
            ? { 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com' }
            : {}),
        },
        params: { base64_encoded: 'false' },
      });
      result = getRes.data;
      if (result.status && result.status.id >= 3) break;
      await sleep(1000);
    }

    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: 'Judge0 error', error: err.message });
  }
};
