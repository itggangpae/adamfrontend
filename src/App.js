import React ,{useState} from 'react';
import AWS from 'aws-sdk'

const S3_BUCKET ='adambuckettest';
const REGION ='ap-northeast-2';

AWS.config.update({
    accessKeyId: 'AKIA264FV5MWPUHV7O7S',
    secretAccessKey: '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'
})

//저장할 버킷 객체 생성 
const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})

function App() {
  //파일 업로드 진행 상태를 저장할 상태 변수
  const [progress , setProgress] = useState(0);
  //업로드할 파일을 저장할 상태 변수
    const [selectedFile, setSelectedFile] = useState(null);

    //file 의 선택을 변경할 때 호출될 함수
    const handleFileInput = (e) => {
      //선택한 파일을 selectFile 에 저장
        setSelectedFile(e.target.files[0]);
    }

    //전송을 누를 때 호출되는 함수
    const uploadFile = (file) => {
        const params = {
            ACL: 'public-read',
            Body: file,
            Bucket: S3_BUCKET,
            Key: file.name
        };
        //전송 함수를 호출
        myBucket.putObject(params)
        .on('httpUploadProgress', (evt) => {
          //전송되는 중간에 전송 비율을 출력
            setProgress(Math.round((evt.loaded / evt.total) * 100))
        })
        .send((err) => {
            if (err) console.log(err)
        })
}

return <div>
    <div>진행 상황을 수정 {progress}%</div>
    <input type="file" onChange={handleFileInput}/>
    <button onClick={() => uploadFile(selectedFile)}> Upload to S3</button>
</div>
}

export default App;

