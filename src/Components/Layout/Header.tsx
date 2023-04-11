import { NavLink, useNavigate } from "react-router-dom";
import { userModel } from "../../Interfaces";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
import {
  emptyUserState,
  setLoggedInUser,
} from "../../Storage/Redux/userAuthSlice";
import { SD_Roles } from "../../Utility/SD";
let logo = require("../../Assets/Images/AmCartLogo.png");

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();



  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setLoggedInUser({ ...emptyUserState }));
    navigate("/");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-light navbar-light">
        <div className="container-fluid">
          <NavLink className="nav-link" aria-current="page" to="/">
            <img alt="description of image" src={logo} style={{ height: "40px" }} className="m-1" />
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="true"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"> </span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 w-100">
              <div className="d-flex" style={{ marginLeft: "auto" }}>
                {userData.id && (
                  <>
                    < li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        Welcome , {userData.fullName}
                      </a>

                      <ul className="dropdown-menu">
                        {userData.role == SD_Roles.ADMIN && <li
                          style={{ cursor: "pointer" }}
                          className="dropdown-item"
                          onClick={() => navigate("menuItem/menuitemlist")}
                        >
                          Menu Item
                        </li>
                        }

                        <li
                          style={{ cursor: "pointer" }}
                          className="dropdown-item"
                          onClick={handleLogout}
                        >
                          Logout
                        </li>
                      </ul>
                    </li>
                  </>
                )}

                {!userData.id && (
                  <>
                    <li className="nav-item text-white">
                      <NavLink className="nav-link" to="/register">
                        Register
                      </NavLink>
                    </li>
                    <li className="nav-item text-white">
                      <NavLink
                        className="btn btn-success btn-outlined rounded-pill text-white mx-2"
                        style={{
                          border: "none",
                          height: "40px",
                          width: "100px",
                        }}
                        to="/login"
                      >
                        Login
                      </NavLink>
                    </li>
                  </>
                )}
              </div>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  aria-current="page"
                  to="/"
                >
                  <i className="bi bi-cart"> Cart </i>{" "}
                  {userData.id && `(5)`}
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav >
    </div >
  );
}

export default Header;
