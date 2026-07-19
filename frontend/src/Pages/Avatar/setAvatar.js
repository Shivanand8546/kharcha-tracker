import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./avatar.css";
import { setAvatarAPI } from "../../utils/ApiRequest.js";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const {
  uniqueNamesGenerator,
  colors,
  animals,
  countries,
  names,
  languages,
} = require("unique-names-generator");

const SetAvatar = () => {
  const sprites = [
    "adventurer",
    "micah",
    "avataaars",
    "bottts",
    "initials",
    "adventurer-neutral",
    "big-ears",
    "big-ears-neutral",
    "big-smile",
    "croodles",
    "identicon",
    "miniavs",
    "open-peeps",
    "personas",
    "pixel-art",
    "pixel-art-neutral",
  ];

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const navigate = useNavigate();

  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [selectedSprite, setSelectedSprite] = useState(sprites[0]);

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }
  }, [navigate]);

  const randomName = () => {
    return uniqueNamesGenerator({
      dictionaries: [animals, colors, countries, names, languages],
      length: 2,
    });
  };

  const [imgURL, setImgURL] = useState([
    `https://api.dicebear.com/7.x/${sprites[0]}/svg?seed=${randomName()}`,
    `https://api.dicebear.com/7.x/${sprites[0]}/svg?seed=${randomName()}`,
    `https://api.dicebear.com/7.x/${sprites[0]}/svg?seed=${randomName()}`,
    `https://api.dicebear.com/7.x/${sprites[0]}/svg?seed=${randomName()}`,
  ]);

  const handleSpriteChange = (e) => {
    const value = e.target.value;
    setSelectedSprite(value);
    setSelectedAvatar(undefined);

    if (value.length > 0) {
      setLoading(true);
      const imgData = [];
      for (let i = 0; i < 4; i++) {
        imgData.push(
          `https://api.dicebear.com/7.x/${value}/svg?seed=${randomName()}`
        );
      }
      setImgURL(imgData);
      setLoading(false);
    }
  };

  const handleShuffle = () => {
    setLoading(true);
    setSelectedAvatar(undefined);
    const imgData = [];
    for (let i = 0; i < 4; i++) {
      imgData.push(
        `https://api.dicebear.com/7.x/${selectedSprite}/svg?seed=${randomName()}`
      );
    }
    setImgURL(imgData);
    setLoading(false);
  };

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    const { data } = await axios.post(`${setAvatarAPI}/${user._id}`, {
      image: imgURL[selectedAvatar],
    });

    if (data.isSet) {
      user.isAvatarImageSet = true;
      user.avatarImage = data.image;
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Avatar selected successfully", toastOptions);
      navigate("/");
    } else {
      toast.error("Error Setting avatar, Please Try again", toastOptions);
    }
  };

  return (
    <div className="avatarPageWrapper">
      <div className="avatarHeaderBox">
        <div className="avatarLogoBox">
          <AccountBalanceWalletIcon sx={{ fontSize: 26, color: "#fff" }} />
        </div>
        <h2 className="avatarTitle">Choose your avatar</h2>
        <p className="avatarSubtitle">Pick a style that feels like you</p>
      </div>

      {loading ? (
        <div className="avatarLoadingText">Loading avatars...</div>
      ) : (
        <div className="avatarGrid">
          {imgURL.map((image, index) => (
            <div
              key={index}
              className={`avatarCard ${
                selectedAvatar === index ? "avatarCardSelected" : ""
              }`}
              onClick={() => setSelectedAvatar(index)}
            >
              <img src={image} alt="" className="avatarImg" />
            </div>
          ))}
        </div>
      )}

      <div className="avatarControls">
        <div className="avatarSelectWrapper">
          <label className="avatarLabel">Avatar style</label>
          <select
            onChange={handleSpriteChange}
            value={selectedSprite}
            className="avatarSelect"
          >
            {sprites.map((sprite, index) => (
              <option value={sprite} key={index}>
                {sprite}
              </option>
            ))}
          </select>
        </div>

        <button className="avatarShuffleBtn" onClick={handleShuffle}>
          🔀 Shuffle
        </button>
      </div>

      <button className="avatarSubmitBtn" onClick={setProfilePicture}>
        Set as Profile Picture
      </button>

      <ToastContainer />
    </div>
  );
};

export default SetAvatar;