import { pipeline } from '@xenova/transformers';

const statusEl = document.getElementById('status');
const runBtn = document.getElementById('runBtn');
const promptEl = document.getElementById('prompt');
const uploadEl = document.getElementById('imgUpload');
const inputImg = document.getElementById('inputImg');
const outputImg = document.getElementById('outputImg');

let generator = null;
let uploadedImage = null;

// 載入模型
async function loadModel() {
  statusEl.textContent = "正在載入AI模型，請稍候（第一次會下載模型檔案）";
  try {
    generator = await pipeline('image-to-image', 'Xenova/stable-diffusion-v1-5-image-to-image');
    statusEl.textContent = "✅模型載入完成，可以開始繪圖";
    runBtn.disabled = false;
  } catch (err) {
    statusEl.textContent = "❌模型載入失敗：" + err.message;
    console.error(err);
  }
}

// 讀取上傳圖片
uploadEl.onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  inputImg.src = url;
  uploadedImage = await createImageBitmap(file);
};

// 點擊生成
runBtn.onclick = async () => {
  if(!generator || !uploadedImage) {
    statusEl.textContent = "請先上傳一張參考圖！";
    return;
  }
  runBtn.disabled = true;
  statusEl.textContent = "正在生成圖片...";
  try{
    const result = await generator(uploadedImage, {
      prompt: promptEl.value || "beautiful girl",
      num_inference_steps:20
    });
    outputImg.src = result[0].url;
    statusEl.textContent = "✅圖片生成完畢";
  }catch(err){
    statusEl.textContent = "❌生成失敗：" + err.message;
    console.error(err);
  }
  runBtn.disabled = false;
};

// 開始建載模型
loadModel();
