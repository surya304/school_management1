// All the Generic Functions which will be used through out the app will go here

import * as moment from "moment";
import User from "../models/User";
import UserInfo from "../models/UserInfo";
import Media from "../models/Media";
import Track from "../models/Track";
import WhiteLabel from "../models/WhiteLabel";
import Alert from "../models/Alert";
import Attendance from "../models/Attendance";
import Category from "../models/Category";
import Klass from "../models/Klass";
import Event from "../models/Event";
import Exams from "../models/Exam";
import ExamMark from "../models/ExamMark";
import Fee from "../models/Fee";
import FeePayment from "../models/FeePayment";
import School from "../models/School";
import Student from "../models/Student";
import Subject from "../models/Subject";
import FamilyData from "../models/FamilyData";
import Teacher from "../models/Teacher";


const { Storage } = require("@google-cloud/storage");

const { v4: uuidv4 } = require("uuid");
const momentTZ = require("moment-timezone");

// //AWS
// var accessKeyId = process.env.AWS_KEY;
// var secretAccessKey = process.env.AWS_SECRET;
// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_KEY,
//     secretAccessKey: process.env.AWS_SECRET,
// });

// AWS.config.update({
//     accessKeyId: accessKeyId,
//     secretAccessKey: secretAccessKey,
//     region: "us-east-1",
// });


const AWS = require("aws-sdk");
var accessKeyId = process.env.AWS_KEY;
var secretAccessKey = process.env.AWS_SECRET;
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
});

AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: "us-east-1",
});




// Function to Pick which Object the operations should be performed
function getObject(name) {
  console.log(name,"getObject file")
  switch (name) {
    case "User":
      return User;

    case "UserInfo":
      return UserInfo;

    case "Media":
      return Media;

    case "Track":
      return Track;

    case "WhiteLabel":
      return WhiteLabel;

    case "Alert":
      return Alert;

    case "Attendance":
      return Attendance;

    case "Category":
      return Category;

    case "Klass":
      return Klass;

    case "Event":
      return Event;

    case "Exams":
      return Exams;

    case "ExamMark":
      return ExamMark;

    case "Fee":
      return Fee;

    case "FeePayment":
      return FeePayment;

    case "School":
      return School;

    case "Student":
      return Student;
    
    case "Subject":
      return Subject;
    
    case "Teacher":
      return Teacher;

      case "FamilyData":
        return FamilyData;
      
  }
}




// GET Request
const fetchRecords = (data) => {
  let url = data.url;



  let query = undefined;

  return new Promise(function (resolve, reject) {

  if (data.type == "find") {
  

    query = getObject(data.modal).find(data.condition);


    if (data.limit) {
      query.limit(data.limit);
    }

    if (data.skip) {
      query.skip(data.skip);
    }
  } else if (data.type == "findById") {
    query = getObject(data.modal).findById(data.id);
  } else if (data.type == "findOne") {
    query = getObject(data.modal).findOne(data.condition);
  }

  if (data.selectFields) {
    query.select(data.selectFields);
  } else {
    reject("selectFields is Missing");
  }

  if (data.populate) {

    for (const iterator of data.populate) {

        let obj = iterator.select;
        let key = getKeyByValue(obj, 1);

        if (key == "all") {
          // Populate all fields
          if (iterator.hasOwnProperty("match")) {
            let newObj = {
              match: iterator.match,
              path: iterator.path,
            };
            query.populate(newObj);
          } else {
            query.populate(iterator.path);
          }
        } else {
          query.populate(iterator);
        }

    }
   
  }

  if (data.orderBy) {
    if (data.orderByKey) {
      let order = -1;
      if (data.orderBy == "asc") {
        order = 1;
      }

      if (data.orderByKey == "name") {
        query.sort({ name: order });
      }
      if (data.orderByKey == "created_at") {
        query.sort({ created_at: order });
      }
      if (data.orderByKey == "email") {
        query.sort({ email: order });
      }
    } else {
      if (query.orderBy == "desc") {
        query.sort({ created_at: 1 });
      } else {
        query.sort({ created_at: -1 });
      }
    }
  }

  
    query.exec(function (err, result) {
      if (err) {
        errorLog(url, err);
        reject(err);
      } else {
        if (result) {
          resolve(result);
        } else {
          resolve([]);
        }
      }
    });
  });
};

// PUT Request
const updateRecord = (data) => {

  let url = data.url;
  let updateFields = data.updateFields;

  let query = undefined;

  return new Promise(function (resolve, reject) {
    
    if (data.type == "findOne") {
      query = getObject(data.modal).findOne(data.condition);
    } else {
      query = getObject(data.modal).findById(data.id);
    }

    if (data.selectFields) {
      query.select(data.selectFields);
    } else {
      reject("selectFields are Missing");
    }

    query.exec(function (err, result) {
      if (err) {
        errorLog(url, err);
        reject(err);
      } else {
        if (result) {
          for (let i = 0; i < updateFields.length; i++) {
            result[updateFields[i].key] = updateFields[i].value;
          }

          result.save(function (err1, updatedResult) {
            if (err1) {
              errorLog(url, err1);
              reject(err1);
            } else {
              resolve(updatedResult);
            }
          });
        } else {
          resolve("empty");
        }
      }
    });
  });
};

// DELETE Request
const deleteRecord = (data) => {
  let url = data.url;
  let query = undefined;

  if (data.type == "findOne") {
    query = getObject(data.modal).findOne(data.condition);
  } else {
    query = getObject(data.modal).findById(data.id);
  }

  return new Promise(function (resolve, reject) {
    query.exec(function (err, result) {
      if (err) {
        errorLog(url, err);
        reject(err);
      } else {
        result.is_del = true;

        result.save(function (err1) {
          if (err1) {
            errorLog(url, err1);
            reject(err1);
          } else {
            resolve("deleted");
          }
        });
      }
    });
  });
};

// DELETE Request
const deleteRecordPermanently = (data) => {
  let url = data.url;
  let query = getObject(data.modal).findById(data.id);

  return new Promise(function (resolve, reject) {
    query.exec(function (err, result) {
      if (err) {
        errorLog(url, err);
        reject(err);
      } else {
        result.remove(function (err1) {
          if (err1) {
            errorLog(url, err1);
            reject(err1);
          } else {
            resolve("deleted");
          }
        });
      }
    });
  });
};

// GET Request
const getRecordsCount = (data) => {
  let url = data.url;

  let p = getObject(data.modal).find(data.condition);

  return new Promise(function (resolve, reject) {
    p.countDocuments(function (err, count) {
      if (err) {
        errorLog(url, err);
        reject(err);
      } else {
        resolve(count);
      }
    });
  });
};

function hasJsonStructure(str) {
  if (typeof str !== "string") return false;
  try {
    const result = JSON.parse(str);
    const type = Object.prototype.toString.call(result);
    return type === "[object Object]" || type === "[object Array]";
  } catch (err) {
    return false;
  }
}

const errorLog = (url, errorObj) => {
  if (
    process.env.NODE_ENV == "production" ||
    process.env.NODE_ENV == "staging"
  ) {
    let nowDate = new Date();
    let errorText = "";
    if (errorObj) {
      if (hasJsonStructure(errorObj)) {
        errorText = JSON.stringify(errorObj);
      } else {
        errorText = errorObj;
      }
    }
    let errorFile =
      "Time - " +
      moment().format("DD-MMM-YYYY h:mm:ss a") +
      "\n" +
      "URL - " +
      url +
      "\n" +
      "Error - " +
      errorText +
      "\n\n";

    let fileName = moment(nowDate).format("DD-MMM-YYYY") + "-logs.txt";

    // Add Code to Send Error to CloudWatch
  } else {
    console.log("Error in URL>>>>>", url);
    console.log("Error Details>>>>>", errorObj);
  }
};

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}







function uploadImageToS3(response, type, from) {
    return new Promise(function(resolve, reject) {
        var uuid = uuidv4();
        // var type = "jpg";
        // if (mimetype == "image/jpeg") {
        //     type = "jpeg";
        // } else if (mimetype == "image/png") {
        //     type = "png";
        // } 
        let filenameS3 =
            momentTZ(new Date()).tz("Asia/Calcutta").format("HH-mm-ss") +
            "-" +
            uuid +
            "." +
            type;

          console.log(filenameS3,"filenameS3")
        var bucketPath = process.env.AWS_s3_bucket;
        
   



        const accelerated_s3 = new AWS.S3({
            accessKeyId: process.env.AWS_KEY,
            secretAccessKey: process.env.AWS_SECRET,
            endpoint: new AWS.Endpoint(bucketPath + ".s3-accelerate.amazonaws.com"),
            useAccelerateEndpoint: true,
        });
        var uploadParams = {
            Bucket: bucketPath,
            Key: "",
            ContentType: type,
            Body: "",
            ACL: "",
        };
        uploadParams.Body = response;
        uploadParams.Key = filenameS3;
        // call S3 to retrieve upload file to specified bucket
        accelerated_s3.upload(uploadParams, function(err, data) {
            if (err) {
                console.log("Error", err);
                // if (filename) {
                //     fs.unlinkSync(filename);
                // }
                resolve({ data: data, message: "error" });
            }
            if (data) {
                console.log("Upload Success", data.Location);
                // if (filename) {
                //     fs.unlinkSync(filename);
                // }
                resolve({ data: data, message: "success" });
            }
        });
    });
}





 function generateV4ReadSignedUrl(bucketName, fileName) {
   // These options will allow temporary read access to the file
   const options = {
     version: "v4",
     action: "read",
     expires: Date.now() + 15 * 60 * 1000, // 15 minutes
   };

   // Get a v4 signed URL for reading the file

   return new Promise(async function (resolve, reject) {
      const [url] = await admin
     .storage()
     .bucket(bucketName)
     .file(fileName)
     .getSignedUrl(options);
      resolve(url);
   })

  
 }

 const getCount = (data) => {
  // console.log("Data Received>>>>>", data);
  let url = data.url;
  // data.condition = sanitizeField(data.condition)

  var p = getObject(data.modal).find(data.condition);

  return new Promise(function(resolve, reject) {
      p.countDocuments(function(err, count) {
          if (err) {
              errorLog(url, err);
              reject(err);
          } else {
              resolve(count);
          }
      });
  });
};



module.exports = {
  errorLog,
  fetchRecords,
  deleteRecord,
  updateRecord,
  getRecordsCount,
  deleteRecordPermanently,
  generateV4ReadSignedUrl,
  uploadImageToS3,
  getCount
};
