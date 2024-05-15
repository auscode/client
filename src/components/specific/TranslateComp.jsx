import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  Stack,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setIsTranslate, setSelectedLanguage } from "../../redux/reducers/misc";

const TranslateComp = () => {
  const dispatch = useDispatch();
  const { isTranslate } = useSelector((state) => state.misc);
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [input, setInput] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("");
  useEffect(() => {
    const fetchLanguages = async () => {
      const options = {
        method: "GET",
        url: "https://deep-translate1.p.rapidapi.com/language/translate/v2/languages",
        headers: {
          "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
          "X-RapidAPI-Host": import.meta.env.VITE_RAPIDAPI_HOST,
        },
      };

      try {
        const response = await axios.request(options);
        const languages = response.data.languages;
        setOptions(languages);
        setFilteredOptions(languages);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLanguages();
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    const filtered = options.filter(
      (option) =>
        option.code?.toLowerCase().includes(inputValue) ||
        option.name?.toLowerCase().includes(inputValue)
    );
    setFilteredOptions(filtered);
    setInput(inputValue);
  };

  const handleOptionClick = (name) => {
    setSourceLanguage(name);
    dispatch(setSelectedLanguage(name));
    dispatch(setIsTranslate(false));
  };

  useEffect(() => {
    console.log("", sourceLanguage);
  }, [sourceLanguage]);

  const tranlateCloseDialog = () => dispatch(setIsTranslate(false));

  return (
    <>
      <Dialog open={isTranslate} onClose={tranlateCloseDialog}>
        <Stack p={"2rem"} direction={"column"} width={"25rem"}>
          <DialogTitle textAlign={"center"}>Choose Language</DialogTitle>
          <TextField
            label="Search Language"
            value={input}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            margin="normal"
          />
          <List>
            {filteredOptions.map((option, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <ListItemText
                    primary={option.name}
                    onClick={() => handleOptionClick(option.language)}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Dialog>
    </>
  );
};

export default TranslateComp;
