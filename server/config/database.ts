import mongoose from 'mongoose'

const URI = process.env.MONGODB_URL 

mongoose.connect(`${URI}`, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if(err) throw err;
  console.log('Mongodb connection')
})



// import mongoose from 'mongoose'

// const URI = process.env.MONGODB_URL 

// mongoose.connect(`${URI}`, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
//   useUnifiedTopology: true
// })
// .then((res)=>{
//     console.log('Mongodb connection')
// })
// .catch((err)=>{
//     if(err) throw err;
// })