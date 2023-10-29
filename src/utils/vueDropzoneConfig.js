const HOST = import.meta.env.VITE_HOST;

const options = {
  addRemoveLinks: true,
  url: HOST,
  thumbnailWidth: 150,
  maxFilesize: 0.5, // 500Kb
  autoProcessQueue: false,
};

export { options };
