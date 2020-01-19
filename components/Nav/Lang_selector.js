import React from 'react';
import ReactDOM from "react-dom";
import { withStyles } from "@material-ui/core/styles";
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import labels from '../../constants/labels'


const styles = theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  }
});

class LangSelector extends React.Component {

  constructor(props) {
    super(props);
  this.state = {
    lang: localStorage.getItem('locale'),
    labelWidth: 0,
    checkedA:false
  };
  this.handleChange = this.handleChange.bind(this);
}

  componentDidMount()
  {
  }

  handleChange()
  {
      
    var lang = event.target.value;
    this.setState({lang: lang});

    localStorage.setItem('locale', lang);
    this.props.handleChangeLocale(localStorage.getItem('locale'));
  };

  render() {
    const { classes } = this.props;
    this.InputLabelRef = React.createRef();
  return (
        <React.Fragment>

 <FormControl variant="filled" className={classes.formControl}>
        <InputLabel htmlFor="age-native-simple">{labels[this.state.lang].langLabel}</InputLabel>
        <Select
        native
          defaultValue={this.state.lang}
          onChange={this.handleChange}
          inputProps={{
            name: "langue",
            id: 'age-native-simple',
          }}
        >
          <option value={"fr"}>Français</option>
          <option value={"en"}>English</option>
        </Select>
      </FormControl>

          {/* <FormControlLabel
    control={<Switch checked={this.state.checkedA} onChange={this.handleChange} />}
    label="English"
  /> */}
      {/* <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel ref={this.InputLabelRef} htmlFor="outlined-age-simple">
            Langue
          </InputLabel>
          <Select
            value={this.state.lang}
            onChange={this.handleChange}
            input={
              <OutlinedInput
                labelWidth={this.state.labelWidth}
                name="Langue"
                id="Lnague_selector"
              />
            }
          >
            <MenuItem value={"fr"}>Français</MenuItem>
            <MenuItem value={"en"}>English</MenuItem>
          </Select>
        </FormControl> */}
        </React.Fragment>
      );
}
}

export default withStyles(styles)(LangSelector);
