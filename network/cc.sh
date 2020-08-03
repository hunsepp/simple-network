#chaincode install
docker exec cli peer chaincode install -n mysacc -v 1.2 -p github.com/mysacc
#chaincode instatiate
 docker exec cli peer chaincode upgrade -n mysacc -v 1.2 -C mychannel -c '{"Args":[]}' -P 'OR ("Org1MSP.member", "Org2MSP.member","Org3MSP.member")'

#docker exec cli peer chaincode upgrade -n mysacc 0v 1.1 -C mychannel -c '{"ARgs":["a","100"]}' -P 'OR ("Org1MSP.Member", "Org2MSP.member","Org3MSP.member")'

sleep 5

#chaincode invoke b
docker exec cli peer chaincode invoke -n mysacc -C mychannel -c '{"Args":["set","b","230"]}'
sleep 5
#chaincode query b
docker exec cli peer chaincode query -n mysacc -C mychannel -c '{"Args":["get","b"]}'

docker exec cli peer chaincode query -n mysacc -C mychannel -c '{"Args":["getAllKeys"]}'

echo '-----------------------------END------------------------------'
