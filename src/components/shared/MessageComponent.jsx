import { Box, Typography } from "@mui/material";
import { memo, useState, useEffect } from "react";
import { lightBlue } from "../../constants/color";
import moment from "moment";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

import axios from "axios";

const translateContent = async (content, sourceLanguage, targetLanguage) => {
  try {
    const options = {
      method: "POST",
      url: "https://deep-translate1.p.rapidapi.com/language/translate/v2",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
        "X-RapidAPI-Host": import.meta.env.VITE_RAPIDAPI_HOST,
      },
      data: {
        q: content,
        source: sourceLanguage,
        target: targetLanguage,
      },
    };

    const response = await axios.request(options);
    const translatedText = response.data.data.translations.translatedText;
    return translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return "Translation failed";
  }
};

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;
  const sameSender = sender?._id === user?._id;

  const timeAgo = moment(createdAt).fromNow();

  // acessing it from redux which is chosen from the translateComponent
  const selectedLanguage = useSelector((state) => state.misc.selectedLanguage);
  // console.log("lang selec8 " + selectedLanguage);

  const [translatedContent, setTranslatedContent] = useState(content);
  // console.log("setTranslatedContent " + translatedContent);

  useEffect(() => {
    const fetchTranslation = async () => {
      if (selectedLanguage && content) {
        // console.log("in if" + content);
        // console.log("in if" + selectedLanguage);
        const translatedText = await translateContent(
          content,
          "en",
          selectedLanguage
        );
        setTranslatedContent(translatedText);
      }
    };
    fetchTranslation();
  }, [selectedLanguage, content]);

  return (
    <motion.div
      initial={{ opacity: 0, x: "-100%" }}
      whileInView={{ opacity: 1, x: 0 }}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: "white",
        color: "black",
        borderRadius: "5px",
        padding: "0.5rem",
        width: "fit-content",
      }}
    >
      {!sameSender && (
        <Typography color={lightBlue} fontWeight={"600"} variant="caption">
          {sender.name}
          {/* message-text */}
        </Typography>
      )}
      {content && (
        <Typography>
          {/* og-msg */}
          {/* {content}
          {translatedContent} */}
          {selectedLanguage ? translatedContent : content}
        </Typography>
      )}

      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);

          return (
            <Box key={index}>
              <a
                href={url}
                target="_blank"
                download
                style={{
                  color: "black",
                }}
              >
                {/* message-in-file */}
                {RenderAttachment(file, url)}
              </a>
            </Box>
          );
        })}
      <Typography variant="caption" color={"text.secondary"}>
        {timeAgo}
        {/* message-component */}
      </Typography>
    </motion.div>
  );
};

export default memo(MessageComponent);
