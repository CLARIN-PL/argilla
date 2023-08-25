export default {
  prev: "Poprzedni",
  next: "Następny",
  of: "z",
  records: "rekordów",
  searchDatasets: " Szukaj zbiorów danych",
  name: "Nazwa",
  workspace: " Obszar roboczy",
  task: "Zadanie",
  tags: " Tagi",
  createdAt: " Utworzono w",
  updatedAt: " Zaktualizowano w",
  goToDatasetSettings: "Przejdź do ustawień zbioru danych",
  copyUrlToClipboard: "Kopiuj adres URL do schowka",
  datasetsSettings: "Ustawienia zbiorów danych",
  noDatasetsFound: "Znaleziono 0 zestawów danych",
  annotationGuidelines: "Wytyczne dotyczące anotacji",
  seeYourDataset: "Zobacz swój zbiór danych",
  recordsPerPage: "Liczba rekordów na stronie:",
  youHaveReached:
    "Dotarłeś/łaś do końca danych dla kolejki {recordStatusToFilterWith}",
  youHaveNoRecords: "Nie masz żadnych rekordów: {recordStatusToFilterWith}",
  youHaveNoRecordsMatchingSearch:
    "Nie masz rekordów pasujących do danych wejściowych wyszukiwania: {recordStatusToFilterWith}",
  yourChangesWillBeLostOnViewChange:
    " Zmiany zostaną utracone po przejściu do innego widoku",
  yourChangesWillBeLostOnSearch:
    " Zmiany zostaną utracone, jeśli zastosujesz filtr wyszukiwania",
  youCannotGoThrough: `<p>
  Nie można przejść przez więcej niż {formatted_limit} rekordów.
  Aby wyświetlić więcej rekordów, można połączyć zapytania, filtry i sortowanie w celu ograniczenia wyników wyszukiwania.
  Zobacz ten    <a
      href="https://docs.argilla.io/en/latest/guides/features/queries.html?highlight=queries#"
      target="_blank"
    >
  przewodnik</a> dotyczący korzystania z zaawansowanych zapytań.
  </p>`,
  datasetsEmpty: " Nie ma jeszcze żadnych zestawów danych",
  datasetsEmptyDescription: `Aplikacja internetowa Argilla umożliwia rejestrowanie, eksplorowanie i dodawanie anotacji do danych.<br />
  Rozpocznij rejestrowanie danych za pomocą naszego klienta pythonowego lub
  <a href="https://docs.rubrix.ml/" target="_blank" >sprawdź dokumentację</a>, aby uzyskać więcej informacji.`,
  createLabel: " Utwórz etykietę",
  saveLabels: " Zapisz etykiety",
  actionNeeded: `Potrzebna akcja: Zapisz etykiety, aby zweryfikować schemat anotacji. Więcej w
  <a target='_blank' href='https://docs.argilla.io/en/latest/guides/log_load_and_prepare_data.html#Define-a-labeling-schema'>
  dokumentacji</a>`,
  youHaveNoLabels:
    " Nadal nie masz etykiet w swoim zbiorze danych, zacznij od ich utworzenia",
  removeSimilarRecordsFilter: " Usuń filtr podobnych rekordów",
  ifYouHaveVectors:
    "Jeśli masz wektory w swoich rekordach, możesz znaleźć najbardziej podobne rekordy do danego rekordu",
  removeAllFilters: " Usuń wszystkie filtry",
  moreFilters: " Więcej filtrów",
  onlyRecordsNotCoveredByRules: " Tylko rekordy nieobjęte regułami",
  zeroResults: "0 wyników",
  deleteRule: " Usuń regułę",
  zeroRulesDefined: "0 zdefiniowanych reguł",
  zeroRulesFound: "0 znalezionych reguł",
  noDataInfo: "Nie zdefiniowano jeszcze żadnych reguł dla tego zbioru danych",
  query: "Kolejka",
  labels: " Etykiety",
  coverage: " Pokrycie",
  annotationCoverage: " Pokrycie anotacji",
  anCoverage: "Pokrycie an.",
  correct: "Poprawna",
  incorrect: "Niepoprawna",
  precision: "Precyzja",
  precisionDescription:
    "Procent poprawnych etykiet podanych przez regułę w odniesieniu do anotacji",
  correctDescription:
    "Liczba etykiet, które reguła przewidziała poprawnie w odniesieniu do anotacji",
  coverageDescription: "Procent rekordów oznaczonych przez regułę",
  annotationCoverageDescription:
    "Procent zaanotowanych rekordów oznaczonych przez regułę",
  incorrectDescription:
    "Liczba etykiet, które reguła przewidziała nieprawidłowo w odniesieniu do anotacji",
  permanentlyDeleteRule: "Trwale usuń regułę",
  youAreAboutToDelete: "Zamierzasz usunąć regułę",
  fromYourDatasetThis: "z twojego zbioru danych. Tej akcji nie można cofnąć",
  pendingActionsWillBeLost:
    "Oczekujące akcje zostaną utracone po odświeżeniu strony",
  okGotIt: "Ok, rozumiem!",
  notFoundDatasetNamed: "Nie znaleziono nazwanego zbioru danych",
  recordsAreDiscarded: "rekordy są odrzucane",
  oneRecordIsDiscarded: "1 rekord został odrzucony",
  recordsCouldHaveNotBeenDiscarded: "rekordy nie mogły zostać odrzucone",
  recordsAreValidated: "rekordy są sprawdzane",
  oneRecordIsValidated: "1 rekord został zatwierdzony",
  recordsCouldHaveNotBeenValidated: "rekord nie mógł zostać zatwierdzony",
  labelsAlreadyExist: `Etykiety <b>'{newLabels}'</b> już istnieją na liście etykiet`,
  labelsAreUpdated: "Etykiety zostały zaktualizowane!",
  labelsCouldntBeSaved: `STATUS:{status} Nie można zapisać etykiet zbioru danych {datasetName} z zadaniem {datasetTask}`,
  hasBeenDeleted: "został usunięty",
  itsNotPossibleToDelete: "Usunięcie nie jest możliwe",
  ruleCantBeDeleted: "Nie można usunąć reguły '{query}'",
  ruleIsDeleted: "Reguła '{query}' została usunięta",
  oneRecordCouldntBeSetAsNot: "1 rekord nie mógł zostać ustawiony jako nie",
};
