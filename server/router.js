// const ref = require('ref-napi');
// const ArrayType = require('ref-array-di')(ref);

const libvision = require('./lib/vision/corewrap');
const visiontypes = require('./lib/vision/datatypes');

const libnmengine = require('./lib/nmengine/corewrap');
const nmenginetypes = require('./lib/nmengine/datatypes');

module.exports = app => {
  app.get('/', (req, res) => {
    res.send('hello world 10:41 된댜 키키키');
  })
  // app.get('/blur_average', (req, res) => {

  //   let query = req.query;

  //   let sizeInfo = new visiontypes.SizeInfo();
  //   sizeInfo.width = query.width;
  //   sizeInfo.height = query.height;
  
  //   let imageInfo = new visiontypes.ImageInfo();
  //   let parsedData = JSON.parse(query.data);

  //   imageInfo.data = ref.alloc('uint8', parsedData);
  //   imageInfo.size = query.sizeInfo;
  //   imageInfo.color = query.color;
  //   imageInfo.bytes_per_pixel = query.bytes_per_pixel;
  //   imageInfo.coordinate = query.coordinate;

  //   let imageInfoPtr = ref.alloc(visiontypes.ImageInfo, imageInfo);
  //   let resultImageBuffer = ArrayType('uint8', parsedData.size);
  //   let resultImagePtr = ref.alloc(resultImageBuffer);


  //   console.log(resultImagePtr);
  //   libvision.getAverageBlur(imageInfoPtr, resultImagePtr);
  //   console.log(resultImagePtr);

  //   res.send(query.data);
  // });

  // app.get('/blur_average/:data/:width/:height/:color/:bytes_per_pixel/:coordinate', (req, res) => {

  //   let params = req.params;
  //   console.log(params);

  //   // libvision.getAverageBlur();

  //   res.send(params);
  // });

  app.get('/api/customers', (req, res) => {
    const customers = [
      {id: 1, firstName: 'John', lastName: 'Doe'},
      {id: 2, firstName: 'Brad', lastName: 'Traversy'},
      {id: 3, firstName: 'Mary', lastName: 'Swanson'},
    ];
    res.json(customers);
  });
}