//웹서버 모듈포함
const express = require('express');
//express를 객체화
const app = express();
var bodyParser = require('body-parser');
//웹서버 설정
//fabric 연결정보 설정
const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const ccpPath = path.resolve(__dirname, '..', 'network' ,'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
//express 설정
const PORT = 8080;
const HOST = '0.0.0.0';

app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//페이지라우팅
//1.1 index.html
app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
})
//유저 추가하기
app.post('/mate', async(req, res)=>{
    //넘겨오는 name 저장
    const name = req.body.name;
   
    //인증서 가져오기
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const userExists = await wallet.exists('user1');
    if (!userExists) {
        console.log('An identity for the user "user1" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
    }
    //체인코드 수행
    //web client에 결과 반환
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('teamate');
    await contract.submitTransaction('addUser', name);
    console.log('Transaction addUser has been submitted');
    await gateway.disconnect();

    res.status(200).send('Transaction addUser has been submitted');
})
//유저 조회하기
app.get('/mate/:name', async(req, res)=>{
    const name = req.params.name;
    console.log("확인!!!!!!!!1",name)
    //인증서 가져오기
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    const userExists = await wallet.exists('user1');
    if (!userExists) {
        console.log('An identity for the user "user1" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
    }
    //체인코드 수행
    //web client에 결과 반환
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('teamate');
    const result = await contract.evaluateTransaction('readRating',name);
    console.log(`Transaction readRating has been evaluated, result is: ${result.toString()}`);

    var obj = JSON.parse(result);
    res.status(200).json(obj);
    
})
//점수 추가하기
app.post('/score', async(req, res)=>{
    //넘어오는 값들 저장하기
    const name = req.body.name;
    const project = req.body.project;
    const score = req.body.score;

    //인증서 가져오기
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const userExists = await wallet.exists('user1');
    if (!userExists) {
        console.log('An identity for the user "user1" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
    }
    //체인코드 수행
    //web client에 결과 반환
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('teamate');
    await contract.submitTransaction('addRating', name,project,score);
    console.log('Transaction addRating has been submitted');
    await gateway.disconnect();

    res.status(200).send('Transaction addRating has been submitted');
})
//REST 라우팅

//2.1 mate 추가 arg:name /mate POST

//2.2 mate 조회 arg:name /mate GET

//2.3 mate project 추가 arg:name,project, socre /score POST

//서버시작 
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);