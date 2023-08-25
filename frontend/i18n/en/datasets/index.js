export default {
  prev: "Prev",
  next: "Next",
  of: "of",
  records: "records",
  searchDatasets: "Search datasets",
  name: "Name",
  workspace: "Workspace",
  task: "Task",
  tags: "Tags",
  createdAt: "Created at",
  updatedAt: "Updated at",
  goToDatasetSettings: "Go to dataset settings",
  copyUrlToClipboard: "Copy URL to clipboard",
  datasetsSettings: "Datasets settings",
  noDatasetsFound: "0 datasets found",
  annotationGuidelines: "Annotation guidelines",
  seeYourDataset: "See your dataset",
  recordsPerPage: "Records per page:",
  youHaveReached:
    "You've reached the end of the data for the {recordStatusToFilterWith} queue.",
  youHaveNoRecords: "You have no {recordStatusToFilterWith} records",
  youHaveNoRecordsMatchingSearch:
    "You have no {recordStatusToFilterWith} records matching search input",
  yourChangesWillBeLostOnViewChange:
    "Your changes will be lost if you move to another view",
  yourChangesWillBeLostOnSearch:
    "Your changes will be lost if you apply the search filter",
  youCannotGoThrough: `<p>
    You cannot go through more than {formatted_limit} records.
    To explore more records, you can combine queries, filters, and sorting to reduce your search results.
    Visit this
    <a
      href="https://docs.argilla.io/en/latest/guides/features/queries.html?highlight=queries#"
      target="_blank"
    >
      guide</a> for using advanced queries.
  </p>`,
  datasetsEmpty: "There aren't any datasets yet",
  datasetsEmptyDescription: `The Argilla web app allows you to log, explore and annotate your data.<br />
  Start logging data with our Python client, or
  <a href="https://docs.rubrix.ml/" target="_blank">see the docs</a> for
  more information.`,
  createLabel: "Create label",
  saveLabels: "Save labels",
  actionNeeded: `Action needed: Save labels to validate the annotation schema. More in
  <a target='_blank' href='https://docs.argilla.io/en/latest/guides/log_load_and_prepare_data.html#Define-a-labeling-schema'>
    docs</a>.
`,
  youHaveNoLabels:
    "You still have no labels in your dataset, start by creating some",
  removeSimilarRecordsFilter: "Remove similar records filter",
  ifYouHaveVectors:
    "If you have vectors in your records, you can find the most similar records to a given one",
  removeAllFilters: "Remove all filters",
  moreFilters: "More filters",
  onlyRecordsNotCoveredByRules: "Only records not covered by rules",
  zeroResults: "0 results",
  deleteRule: "Delete rule",
  zeroRulesDefined: "0 rules defined",
  zeroRulesFound: "0 rules found",
  noDataInfo: `You have not defined any rules for this dataset yet.`,
  query: "Query",
  labels: "Labels",
  coverage: "Coverage",
  annotationCoverage: "Annotation coverage",
  anCoverage: "An. coverage",
  correct: "Correct",
  incorrect: "Incorrect",
  precision: "Precision",
  precisionDescription:
    "Percentage of correct labels given by the rule with respect to the annotations",
  correctDescription:
    "Number of labels the rule predicted correctly with respect to the annotations",
  coverageDescription: "Percentage of records labeled by the rule",
  annotationCoverageDescription:
    "Percentage of annotated records labeled by the rule",
  incorrectDescription:
    "Number of labels the rule predicted incorrectly with respect to the annotations",
  permanentlyDeleteRule: "Permanently delete rule",
  youAreAboutToDelete: "You are about to delete the rule",
  fromYourDatasetThis: "from your dataset. This action cannot be undone.",
  pendingActionsWillBeLost: "Pending actions will be lost when the page is refreshed",
  okGotIt: "Ok, got it!",
  notFoundDatasetNamed: "Not found dataset named",
  recordsAreDiscarded: "records are discarded",
  oneRecordIsDiscarded: "1 record is discarded",
  recordsCouldHaveNotBeenDiscarded: "records could have not been discarded",
  recordsAreValidated: "records are validated",
  oneRecordIsValidated: "1 record is validated",
  recordsCouldHaveNotBeenValidated: "records could have not been validated",
  labelsAlreadyExist: `The labels <b>{newLabels}</b> already exist in the list of labels`,
  labelsAreUpdated: "The labels are updated!",
  labelsCouldNotBeSaved:  `STATUS:{status} The labels of the dataset {datasetName} with task {datasetTask} could not be saved`,
  hasBeenDeleted: "has been deleted",
  itsNotPossibleToDelete: "It is not possible to delete ",
  ruleCantBeDeleted: "Rule '{query}' can't be deleted",
  oneRecordCouldntBeSetAsNot: "1 record couldn't be set as not ",
};
