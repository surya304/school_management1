import dbConnect from "../../../lib/dbConnect";
import {
  uploadImageToS3
} from "../../../lib/genericController";

import formidable from "formidable";


export const config = {
  api: { bodyParser: false },
};

const secret = process.env.NEXTAUTH_SECRET;

var fs = require('fs');

export default async function handler(req, res) {

    await dbConnect();

    const { method } = req;
    switch (method) {
      case "POST":
        try {


          const data = await new Promise(function (resolve, reject) {
            const form = new formidable.IncomingForm();
            form.uploadDir = "./";
            form.keepExtensions = true;
            form.parse(req, async function (err, fields, files) {
              if (err) return reject(err);
              resolve({ fields, files });
            });
          });


          req.body = data.fields;
          console.log("req.body>>>>>1", req.body);
          console.log("data.files>>>>>1", data.files.products.length);
          data.files.products.forEach(element => {
            console.log(element.mimetype, "element");
        });

        } catch (error) {
          // add error handling 
          console.log(error, "error");

          res.status(500).json({ success: false });
        }


        break;
      case "PUT":
        try {








          let url = req.url;
          let picUrl = "";

          const data = await new Promise(function (resolve, reject) {
            const form = new formidable.IncomingForm();
            form.uploadDir = "./";
            form.keepExtensions = true;

            form.parse(req, async function (err, fields, files) {
              if (err) return reject(err);
              resolve({ fields, files });
            });
          });

          req.body = data.fields;



          if (!isEmpty(data.files)) {

            let sizeinb = data.files.filedata.size;

            const bytesToMegaBytes = (bytes) => bytes / 1024 ** 2;
            let size = bytesToMegaBytes(sizeinb).toFixed(2);
            let type = data.files.filedata.mimetype.split("/")[1];
            console.log("type", type);

       

            if (size < 5) {
        

              // //////////////////////////////////
              // let imageBuffer = fs.readFileSync(data.files.filedata);
              let imageBuffer = fs.readFileSync(data.files.filedata.filepath);


              let mimetype = data.files.filedata.mimetype;
              // console.log(mimetype, "mimetype")
              console.log( "mimetype")


                  // Upload Image to S3 and then Update url
              let thumbnailObj = await uploadImageToS3(imageBuffer, type, 'profile')
              console.log("thumbnailObj thumbnailObj>>>>>", thumbnailObj)

              if (thumbnailObj.message == "success") {
                  console.log("Image Uploaded>>>>>", thumbnailObj.data.Location)



          res.status(200).json({ success: true,finalurl:thumbnailObj.data.Location });

              }

            } else {
              res.status(422).json({
                errors: [
                  { type: "File Size", message: "File Size crossed 2 mb" },
                ],
              });
            }
          }


        } catch (error) {
          // add error handling 
          console.log(error, "error")
          res.status(500).json({ success: false });
        }
        break;

      case "GET":
        try {


   


        } catch (error) {
          console.log(error, "errpr")
          // add error handling 
          res.status(500).json({ success: false });
        }
        break;

      default:
        res.status(400).json({ success: false });
        break;
    }

}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
