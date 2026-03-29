import { useFormik } from 'formik';
import { editSchema } from '@/components/schemas';
import Link from 'next/link';
import AvatarUpload from './avatar-upload';

/**
 * ProfileForm - 個人資料編輯表單
 */
export default function ProfileForm({ 
  initialValues, 
  onSubmit, 
  favBarList = [], 
  favMovieList = [],
  sid,
  currentDate
}) {
  const formik = useFormik({
    initialValues,
    validationSchema: editSchema,
    enableReinitialize: true,
    onSubmit
  });

  const { values, touched, errors, isSubmitting, handleBlur, handleChange, handleSubmit } = formik;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col lg:h-full lg:mx-1 xl:mx-1 2xl:mx-12 lg:flex-row card bg-base-300 rounded-box place-items-center p-4 lg:p-8">
        <div className="justify-center avatar lg:basis-1/3">
          <AvatarUpload avatar={userAvatar} onFileChange={handleFileChange} />
        </div>
        <div className="container lg:basis-2/3 mt-4 lg:mt-0">
          {/* Email (Readonly) */}
          <FormInput 
            label="電子郵件" 
            value={values.email} 
            readOnly 
            type="email" 
          />

          {/* Username */}
          <FormInput 
            label="暱稱" 
            name="username"
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.username && errors.username}
          />

          {/* Mobile */}
          <FormInput 
            label="手機號碼" 
            name="mobile"
            type="tel"
            value={values.mobile}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {/* Gender */}
          <FormSelect 
            label="性別" 
            name="gender"
            value={values.gender}
            onChange={handleChange}
            onBlur={handleBlur}
            options={['男', '女']}
            error={touched.gender && errors.gender}
          />

          {/* Birthday */}
          <FormInput 
            label="生日" 
            name="birthday"
            type="date"
            value={values.birthday}
            onChange={handleChange}
            onBlur={handleBlur}
            max={currentDate}
            error={touched.birthday && errors.birthday}
          />

          {/* Bar Fav */}
          <FormSelect 
            label="酒吧喜好" 
            name="fav1"
            value={values.fav1}
            onChange={handleChange}
            onBlur={handleBlur}
            options={favBarList}
            error={touched.fav1 && errors.fav1}
          />

          {/* Movie Fav */}
          <FormSelect 
            label="電影喜好" 
            name="fav2"
            value={values.fav2}
            onChange={handleChange}
            onBlur={handleBlur}
            options={favMovieList}
            error={touched.fav2 && errors.fav2}
          />
        </div>
      </div>

      <div className="divider"></div>

      <div className="flex flex-col justify-start h-full mb-20 lg:mx-1 xl:mx-1 2xl:mx-12 bg-base-100 rounded-box p-4 lg:p-8">
        <label className="text-xl text-light mb-4">關於我：</label>
        <textarea
          name="profile"
          value={values.profile}
          onChange={handleChange}
          placeholder="輸入些什麼..."
          className="w-full h-48 textarea textarea-bordered textarea-lg text-light"
        ></textarea>
        
        <div className="flex justify-end mt-8 gap-4 flex-col sm:flex-row">
          <button
            disabled={isSubmitting}
            type="submit"
            className="btn min-h-[40px] h-[40px] w-full sm:w-[140px] rounded-full border-dark btn-primary bg-primary hover:bg-primary hover:shadow-xl3 hover:border-primary font-bold"
          >
            編輯完成
          </button>
          <Link
            href={`/account/index/${sid}`}
            className="btn min-h-[40px] h-[40px] w-full sm:w-[140px] sm:ml-4 rounded-full btn-outline bg-dark hover:bg-dark text-primary hover:text-primary hover:shadow-xl3 hover:border-dark"
          >
            取消編輯
          </Link>
        </div>
      </div>
    </form>
  );
}

// 內建小組件助於程式碼整潔
const FormInput = ({ label, error, ...props }) => (
  <div className="flex flex-row items-center justify-center mx-4 lg:justify-start mb-7 relative">
    <p className="text-center ms-2 basis-1/2 lg:ms-0 lg:basis-1/3 text-slate-300">{label}：</p>
    <div className="flex flex-col basis-1/2 lg:basis-2/3">
      <input
        {...props}
        className={`input-sm input input-bordered max-w-[320px] ${error ? 'input-error' : ''} ${props.readOnly ? 'bg-slate-800 text-slate-500' : ''}`}
      />
      {error && <p className="absolute bottom-[-20px] text-red-500 text-xs">{error}</p>}
    </div>
  </div>
);

const FormSelect = ({ label, options, error, ...props }) => (
  <div className="flex flex-row items-center justify-center mx-4 lg:justify-start mb-7 relative">
    <p className="text-center ms-2 basis-1/2 lg:ms-0 lg:basis-1/3 text-slate-300">{label}：</p>
    <div className="flex flex-col basis-1/2 lg:basis-2/3">
      <select
        {...props}
        className={`select select-sm select-bordered max-w-[320px] ${error ? 'select-error' : ''}`}
      >
        <option disabled value="請選擇">請選擇</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      {error && <p className="absolute bottom-[-20px] text-red-500 text-xs">{error}</p>}
    </div>
  </div>
);
