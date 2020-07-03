import { Box, Button, CircularProgress, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { Check, Clear } from "@material-ui/icons";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "./components/NavBar";
import PercentageDisplay from "./components/PercentageDisplay";
import AppContext from "./contexts/AppContext";
import useRobofleetMsgListener from "./hooks/useRobofleetMsgListener";
import { fb } from "./schema";
import { matchTopicAnyNamespace } from "./util";

type RobotStatus = {name: string, is_ok: boolean, battery_level: number, status: string, location: string};

export default function Overview() {
  const {setPaused} = useContext(AppContext);
  const [data, setData] = useState({} as {[name: string]: RobotStatus});

  useEffect(() => {
    setPaused(false);
  }, [setPaused]);

  useRobofleetMsgListener(matchTopicAnyNamespace("status"), useCallback((buf, match) => {
    const name = match[1];
    const status = fb.amrl_msgs.RobofleetStatus.getRootAsRobofleetStatus(buf);
    setData(data => ({
      ...data, 
      [name]: {
        name: name,
        is_ok: status.isOk(),
        battery_level: status.batteryLevel(),
        status: status.status() ?? "",
        location: status.location() ?? ""
      }
    }));
  }, []));

  const items = Object.entries(data).map(([name, obj]) => {
    const href = `/robot/${btoa(name)}`;
    return <TableRow key={name}>
      <TableCell align="left">{name}</TableCell>
      <TableCell align="center">
        {obj.is_ok ? <Check/> : <Clear color="error"/>}
      </TableCell>
      <TableCell align="center">
        <PercentageDisplay value={obj.battery_level}/>
      </TableCell>
      <TableCell align="center">{obj.status}</TableCell>
      <TableCell align="center">{obj.location}</TableCell>
      <TableCell align="center">
        <Button component={Link} to={href} size="small" variant="outlined" color="primary">View</Button>
      </TableCell>
    </TableRow>;
  });

  return <>
    <NavBar/>
    <Box height="2em"/>
    <Container component="main" maxWidth="md">
      <Typography variant="h3" component="h2" style={{marginBottom: "0.25em"}}>
        Overview
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell style={{width: "3em"}} align="center">OK</TableCell>
              <TableCell style={{width: "5em"}} align="center">Battery</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Location</TableCell>
              <TableCell style={{width: "80px"}} align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items}
          </TableBody>
        </Table>
        <div style={{padding: "1em", display: "flex", alignItems: "center"}}>
          <CircularProgress variant="indeterminate" disableShrink size={16}/>
          <Typography variant="body2" color="textSecondary" style={{marginLeft: "1em"}}>Watching for new robots</Typography>
        </div>
      </TableContainer>
    </Container>
  </>;
}
