var recLength = 0,
  recBuffersL = [],
  recBuffersR = [],
  sampleRate;
 
this.onmessage = function(e){
  switch(e.data.command){
    case 'init':
      init(e.data.config);
      break;
    case 'record':
      record(e.data.buffer);
      break;
    case 'exportWAV':
      exportWAV(e.data.type);
      break;
    case 'getBuffer':
      getBuffer();
      break;
    case 'clear':
      clear();
      break;
  }
};
 
function init(config){
  sampleRate = config.sampleRate;
}
 
function record(inputBuffer){
  recBuffersL.push(inputBuffer[0]);
  //recBuffersR.push(inputBuffer[1]);
  recLength += inputBuffer[0].length;
}
 
function exportWAV(type){
  var bufferL = mergeBuffers(recBuffersL, recLength);
  var interleaved = interleave(bufferL);
  var dataview = encodeWAV(interleaved);
  var audioBlob = new Blob([dataview], { type: type });
 
  this.postMessage(audioBlob);
}
 
function getBuffer() {
  var buffers = [];
  buffers.push( mergeBuffers(recBuffersL, recLength) );
  this.postMessage(buffers);
}
 
function clear(){
  recLength = 0;
  recBuffersL = [];
  recBuffersR = [];
}
 
function mergeBuffers(recBuffers, recLength){
  var result = new Float32Array(recLength);
  var offset = 0;
  for (var i = 0; i < recBuffers.length; i++){
    result.set(recBuffers[i], offset);
    offset += recBuffers[i].length;
  }
  return result;
}
 
function interleave(inputL){
//修改采样率时 , 要做如下修改
var compression = 44100 / 11025;    //计算压缩率
var length = inputL.length / compression;
var result = new Float32Array(length);
var index = 0,
inputIndex = 0;
while (index < length) {
result[index] = inputL[inputIndex];
inputIndex += compression;//每次都跳过3个数据
index++;
}
return result;
}
 
function floatTo16BitPCM(output, offset, input){
  for (var i = 0; i < input.length; i++, offset+=2){
    var s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}


function floatTo8BitPCM(output, offset, input) {
for (var i = 0; i < input.length; i++, offset++) {    //这里只能加1了
var s = Math.max(-1, Math.min(1, input[i]));
var val = s < 0 ? s * 0x8000 : s * 0x7FFF;
val = parseInt(255 / (65535 / (val + 32768)));     //这里有一个转换的代码,这个是我个人猜测的,就是按比例转换
output.setInt8(offset, val, true);
}
}


function writeString(view, offset, string){
  for (var i = 0; i < string.length; i++){
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
 
function encodeWAV(samples){
//修改采样率  时 , 要添加混合声道时的处理
var dataLength = samples.length;
var buffer = new ArrayBuffer(44 + dataLength);
var view = new DataView(buffer);
var sampleRateTmp = 11205 ;//sampleRate;//写入新的采样率
var sampleBits = 8;
var channelCount = 1;
var offset = 0;
/* 资源交换文件标识符 */
writeString(view, offset, 'RIFF'); offset += 4;
/* 下个地址开始到文件尾总字节数,即文件大小-8 */
view.setUint32(offset, /*32*/ 36 + dataLength, true); offset += 4;
/* WAV文件标志 */
writeString(view, offset, 'WAVE'); offset += 4;
/* 波形格式标志 */
writeString(view, offset, 'fmt '); offset += 4;
/* 过滤字节,一般为 0x10 = 16 */
view.setUint32(offset, 16, true); offset += 4;
/* 格式类别 (PCM形式采样数据) */
view.setUint16(offset, 1, true); offset += 2;
/* 通道数 */
view.setUint16(offset, channelCount, true); offset += 2;
/* 采样率,每秒样本数,表示每个通道的播放速度 */
view.setUint32(offset, sampleRateTmp, true); offset += 4;
/* 波形数据传输率 (每秒平均字节数) 通道数×每秒数据位数×每样本数据位/8 */
view.setUint32(offset, sampleRateTmp * channelCount * (sampleBits / 8), true); offset +=4;
/* 快数据调整数 采样一次占用字节数 通道数×每样本的数据位数/8 */
view.setUint16(offset, channelCount * (sampleBits / 8), true); offset += 2;
/* 每样本数据位数 */
view.setUint16(offset, sampleBits, true); offset += 2;
/* 数据标识符 */
writeString(view, offset, 'data'); offset += 4;
/* 采样数据总数,即数据总大小-44 */
view.setUint32(offset, dataLength, true); offset += 4;
/* 采样数据 */
floatTo8BitPCM(view, 44, samples);
return view;
}
