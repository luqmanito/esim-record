import Cookies from "js-cookie";

const PROD = import.meta.env.PROD;

export const setCookies = (cookies) => {
  Object.keys(cookies).forEach((key) => {
    Cookies.set(key, cookies[key], {
      secure: PROD ? true : false,
    });
  });
};

export const getCookies = (key) => Cookies.get(key);

export const getAllCookies = () => Cookies.get();

export const removeAllCookies = () => {
  Object.keys(Cookies.get()).forEach((key) => {
    Cookies.remove(key);
  });
};
