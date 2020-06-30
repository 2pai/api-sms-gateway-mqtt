require('dotenv').config()
const mqtt = require('./mqtt')
const redis = require('./redis')
const { v4:uuid4 } = require('uuid');
const logger = require('./logger')

const requestOTP = (req,res) => {
    const {PORT} = process.env
    const {phoneNumber} = req.body;
    if(phoneNumber == '' || phoneNumber == undefined){
        res.send(JSON.stringify({ok:0,message:"Payload cannot be null"}))
        return
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    const id = uuid4()
    const payload = JSON.stringify({id:id,phoneNumber:phoneNumber,otp:otp,message:`OTP Code = ${otp}`})
    redis.set(id,payload,60)
    mqtt.publish('2pai-dev/pulsa',payload)
    logger.info('request-otp',payload);
    res.send(JSON.stringify({ok:1,message:"OK",next:`http://${req.hostname}:${PORT}/verifyOtp/${id}`}))
}

const verifyOTP = (req,res) => {
    const {otpCode} = req.body;
    const {id} = req.params;
    if(otpCode == '' || otpCode == undefined){
        res.send(JSON.stringify({ok:0,message:"Payload cannot be null"}))
        return 
    }
    redis.client.get(id,(err,data) => {
        if(data){
            let parsed = JSON.parse(data);
            if (parsed.otp == otpCode){
                res.send(JSON.stringify({ok:1,message:"OTP VALID"}))
            }else{
                res.send(JSON.stringify({ok:0,message:"OTP Invlaid"}))
            }
        }else{
            res.send(JSON.stringify({ok:0,message:"Error!"}))
        }
    })

}
module.exports = {
    requestOTP,
    verifyOTP
}