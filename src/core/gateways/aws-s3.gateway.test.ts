// require('dotenv').config();
// import axios from 'axios';
// import { uploadFromUrl } from './aws-s3.gateway';

// test('#upload', async () => {
//   const name: string = 'test.avif';

//   const result = await uploadFromUrl(
//     'https://images.unsplash.com/photo-1731331344306-ad4f902691a3?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//     name,
//   );

//   const response = await axios.get(result, { responseType: 'arraybuffer' });

//   expect(response.data.length).toBe(1038328);
// });
