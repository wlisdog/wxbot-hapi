import tencentcloud from 'tencentcloud-sdk-nodejs';

/**
 * @author Srecko
 * @desc: 腾讯云nlp调用
 * @date 2022-4-22
 * 凌霄揽胜，雪藏英才。秉坚忍之心，行国士之事，不问青史，不计浮沉。
 */


// const NlpClient = tencentcloud.nlp.v20190408.Client;

// const clientConfig = {
//   credential: {
//     secretId: "AKID3tTmpc9PO6YjdFaeRxFH2WieIfoiRyEF",
//     secretKey: "lFTjna6KJ1RaUu3uUnpaGjwsXw4vWs0s",
//   },
//   region: "ap-guangzhou",
//   profile: {
//     httpProfile: {
//       endpoint: "nlp.tencentcloudapi.com",
//     },
//   },
// };

// const client = new NlpClient(clientConfig);
// const params = {
//     "Query": "辛苦。"
// };
// client.ChatBot(params).then(
//   (data) => {
//     console.log(data);
//   },
//   (err) => {
//     console.error("error", err);
//   }
// );

function getreply(text) {
    const NlpClient = tencentcloud.nlp.v20190408.Client;

    const clientConfig = {
        credential: {
            secretId: "AKID3tTmpc9PO6YjdFaeRxFH2WieIfoiRyEF",
            secretKey: "lFTjna6KJ1RaUu3uUnpaGjwsXw4vWs0s",
        },
        region: "ap-guangzhou",
        profile: {
            httpProfile: {
                endpoint: "nlp.tencentcloudapi.com",
            },
        },
    };

    const client = new NlpClient(clientConfig);
    console.log(text)
    const params = {
        "Query": ""+text+""
    };
    return client.ChatBot(params);
} 

export{
    getreply
};