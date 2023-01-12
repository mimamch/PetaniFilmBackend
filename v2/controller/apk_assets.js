const jwt = require("jsonwebtoken");
const {
  errorWithDefaultMessage,
  successWithData,
} = require("../../utils/http_response_message");

exports.getApkConfiguration = async (req, res) => {
  try {
    const assets = {
      credentials: {
        token: jwt.sign(
          { token: new Date().getTime().toString() },
          "akuganteng"
        ), // FOR TESTING
      },
      caching: {
        // expired_minutes: 60 * 24,
        expired_minutes: 15, // FOR TESTING
      },
      one_signal: {
        app_id: "538bd297-5880-4720-b2f8-0b86f283d2cc",
      },
      ads: {
        show_ads: true,
        interstitial_interval_minutes: 15,
        applovin_sdk_key:
          "eF97zKQbpUaTMGxDis07Jl75fR2uUtm5PnCTaJ_eTFzz0vA5EQlWw996BF6lu5AOv7I6TWfKw7kz4SZkWCboHz",
        applovin_banner_ad_unit_id: {
          // android: "9c9e2a4d7155e261",
          android: "",
          ios: "",
        },
        applovin_merc_ad_unit_id: {
          android: "7e8882a829a2ab84",
          ios: "",
        },
        applovin_interstitial_ad_unit_id: {
          // android: "aa1c03016bdc905f",
          android: "",
          ios: "",
        },
      },
    };
    return res.status(200).json(successWithData(assets));
  } catch (error) {
    console.log(error);
    res.status(500).json(errorWithDefaultMessage());
  }
};
