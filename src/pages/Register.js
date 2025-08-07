import HomeNav from "./HomePage/HomeNav";
import "./Register.css";

const Register = () => {
  return (
    <>
      <HomeNav />
      <div className="register-bg">
        <h3 className="text-center fixed-top jr">JPL Season 6 Registration</h3>
        <div className="button-group">
        <a
          href={process.env.REACT_APP_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-success p-3 rounded"
        >
          New Registration
        </a>
        <a
          href="https://forms.gle/your-edit-registration-form"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-warning mx-3 rounded p-3"
        >
          Edit Registration
        </a>
        <a
          href="https://forms.gle/your-cancel-registration-form"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-danger rounded p-3"
        >
          Cancel Registration
        </a>
      </div>
      </div>
    </>
  );
};

export default Register;
