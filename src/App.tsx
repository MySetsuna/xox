import classNames from 'classnames';
import { useForm, SubmitHandler } from 'react-hook-form';
import { MyCombobox } from './components/MyCombobox';
type Inputs = {
  example: string;
  exampleRequired: string;
};

export default function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({ mode: 'all' });
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  console.log(watch('example')); // watch input value by passing the name of it

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <>
      <MyCombobox />
      <a
        href="#"
        className="has-[.project-name:hover]:bg-red-600 block max-w-xs mx-auto rounded-lg p-6 bg-white ring-1 ring-slate-900/5 shadow-lg space-y-3 hover:bg-sky-500 hover:ring-sky-500"
      >
        <div
          className="flex items-center space-x-3 project-name"
          onClick={() => {
            Notification.requestPermission().then((promise) => {
              const img = '/to-do-notifications/img/icon-128.png';
              const text = `嘿！您的任务“${promise.toString()}”现已过期。`;
              const notification = new Notification('待办列表', {
                body: text,
                icon: img,
              });
              notification.onshow = () => window.location.reload();
            });
          }}
        >
          <h3 className="text-slate-900  group-hover:text-white text-sm font-semibold">
            New project
          </h3>
        </div>
        <p className="text-slate-500 group-hover:text-white text-sm">
          Create a new project from a variety of starting templates.
        </p>
      </a>
      <form onSubmit={handleSubmit(onSubmit)} className=" block">
        {/* register your input into the hook by invoking the "register" function */}
        <label className="block">
          <span className="block text-sm font-medium text-slate-700">
            Username
          </span>
          <input
            className={classNames(
              `mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
            `,
              errors.example &&
                `border-pink-500 text-pink-600
            focus:border-pink-500 focus:ring-pink-500`,
            )}
            defaultValue="test"
            {...register('example', {
              maxLength: { value: 6, message: 'maxLength: 6' },
            })}
            required
          />
          {errors.example && <span>{errors.example.message}</span>}
        </label>
        {/* include validation with required or other standard HTML validation rules */}
        <input
          className={classNames(
            `" mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"`,
            errors.exampleRequired &&
              `border-pink-500 text-pink-600
          focus:border-pink-500 focus:ring-pink-500`,
          )}
          {...register('exampleRequired', { required: true })}
        />
        {/* errors will return when field validation fails  */}
        {errors.exampleRequired && <span>This field is required</span>}

        <button
          type="submit"
          className={classNames(
            'hover:cursor-pointer border-pink-500',
            (!!errors.example || !!errors.exampleRequired) &&
              'hover:cursor-not-allowed',
          )}
          disabled={!!errors.example || !!errors.exampleRequired}
        >
          提交
        </button>
      </form>
    </>
  );
}
