import React, { useContext } from "react";

import OptionContext from "./optionContext";

const LanguageSwitcher = (newOptions) => {
  const { options, setOptions } = useContext(OptionContext);
  setOptions(newOptions);
};

export default LanguageSwitcher;
//sse
//context
