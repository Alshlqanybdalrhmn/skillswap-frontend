import axios from "axios";

const axiosClient = axios.create({
  baseURL: `http://127.0.0.1:8000/api`
});

// 1. interceptor للطلبات (بياخد التوكن من الجهاز ويبعته للسيرفر)
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ACCESS_TOKEN');
  config.headers.Authorization = `Bearer ${token}`
  return config;
})

// 2. [التعديل الجديد] interceptor للردود (بيراقب لو السيرفر طردك)
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    try {
      const { response } = error;
      if (response && response.status === 401) {
        // لو السيرفر قال "غير مصرح"، امسح التوكن فوراً
        localStorage.removeItem('ACCESS_TOKEN');
        // اعمل ريفريش عشان الراوتر يحس إن التوكن اتمسح فيرميك لصفحة اللوجين
        window.location.reload(); 
      }
    } catch (e) {
      console.error(e);
    }
    throw error;
  }
);

export default axiosClient;