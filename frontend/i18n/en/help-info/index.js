export default {
  argillaEnablesYou: ` Argilla enables you to register token attributions as part of the dataset
    records. For getting token attributions, you can use methods such as
    Integrated Gradients or SHAP. These methods try to provide a mechanism to
    interpret model predictions. More in`,
  docs: "docs",
  theAttributionsWork: "The attributions work as follows:",
  positiveAttributions: "Positive attributions",
  negativeAttributions: "Negative attributions",
  inBlue: `(in blue) reflect those
    tokens that are making the model predict the specific predicted label.`,
  inRed: `(in red) reflect those
    tokens that can influence the model to predict a label other than the
    specific predicted label.`,
  sinceCode: `Since <code>1.2.0</code> Argilla supports adding vectors to Argilla
    records which can then be used for finding the most similar records to a
    given one.`,
  thisFeature: ` This feature uses vector or semantic search combined with more traditional
    search (keyword and filter based). Vector search leverages machine
    learning to capture rich semantic features by embedding items (text,
    video, images, etc.) into a vector space, which can be then used to find
    "semantically" similar items.`,
  toBenefit: ` To benefit from this feature, your data team must include vectors
    associated with each record when they create the dataset. More in`,
  help: "Help",
  okGotIt: "Ok, got it!",
  info: "Info",
  similaritySearch: "Similarity Search",
  tokenAttributions: "Token attributions",
  colorsInTokenAttributions: "Colors in token attributions",
};
