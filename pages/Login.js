import {
  Button,
  TextField,
  Link as MaterialLink,
  Card,
  CardContent,
  MuiThemeProvider,
  createTheme,
  Grid,
} from "@material-ui/core";
import { Form } from "react-bootstrap";
import React, { useRef, useState, createContext, useContext } from "react";
import { login, Custom } from "../api/APIHelper";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

const theme = createTheme({
  palette: {
    primary: {
      main: "#016a31",
    },
  },
});

const Newlogin = () => {
  const router = useRouter();
  const toast = useToast({ position: "top" });
  const euidRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // custom hook to handle login and prevent default form behavior
  async function handleSubmit(e) {
    e.preventDefault(); // prevent the default action of the submit button
    const euidValue = euidRef.current.value; // get the value of the input field
    const passwordValue = passwordRef.current.value; // get the value of the input field
    try {
      const response = await login(euidValue, passwordValue); // call the login function from the APIHelper
      if (response) {
        // if the response is not null
        const toastSuccess = toast({
          title: "Login Successful",
          description: "Please wait...",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        // TODO: use switch case instead of if-else and maybe a map
        // TODO: why do some use '==' and other use 'includes'?
        if (router.query && router.query.from) {
          router.push(router.query.from);
          toastSuccess;
        } else if (response.includes("Admin")) {
          router.push("/adminHome");
          toastSuccess;
        } else if (response.includes("Coordinator")) {
          router.push("/instructorHome");
          toastSuccess;
        } else if (response.includes("Instructor")) {
          router.push("/instructorHome");
          toastSuccess;
        } else if (response == "Student") {
          router.push("/studentHome");
          toastSuccess;
        } else {
          // if the response is not null but not one of the roles listed above
          toast({
            title: "Incorrect UserID or password",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        // if the response is null
        toast({
          title: "Failed to login",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      // alert("try 'admin' & 'admin'");
      console.info("try 'admin' & 'admin'");
    }
  }

  return (
    <MuiThemeProvider theme={theme}>
      <Grid
        container
        spacing={0}
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "90vh" }}
      >
        <Grid item xs={6}>
          <Card>
            <CardContent style={{ backgroundColor: "#EDF2F7" }}>
              <h2 className="text-center mb-4">Welcome Back!</h2>
              {error && (
                <Alert variant="outlined" severity="error" className="mb-4">
                  {error}
                </Alert>
              )}
              <h6 className="text-center mb-4">
                We're so excited to see you again.
              </h6>

              <Form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "5px",
                  }}
                >
                  <TextField
                    required
                    id="standard-required"
                    label="EUID"
                    defaultValue=""
                    inputRef={euidRef}
                    className="w-100 text-center mt-5"
                    fullWidth
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "5px",
                  }}
                >
                  <TextField
                    required
                    id="standard-required"
                    label="Password"
                    defaultValue=""
                    type="password"
                    inputRef={passwordRef}
                    className="w-100 text-center mt-5"
                    fullWidth
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "15px",
                  }}
                >
                  <Button
                    color="primary"
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    className="w-100 text-center"
                  >
                    Log In
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MuiThemeProvider>
  );
};

export default Newlogin;
