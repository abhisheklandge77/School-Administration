import { useEffect, useState, useCallback } from "react";
import styles from "./Body.module.scss";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import Tooltip from "@mui/material/Tooltip";
import {
  getAllSchools,
  getClasses,
  getStudents,
  mapAdvanceSearchCardDetails,
  mapGlobalSearchCardDetails,
  searchData,
} from "../utils";
import SchoolCard from "./SchoolCard";
import {
  CardDetails,
  GlobaSearchDetails,
  MappedClass,
  MappedSchool,
  Student,
} from "../types";
import { debounce } from "@mui/material";

function Body() {
  const schoolslist = getAllSchools();

  const [searchBarValue, setSearchBarValue] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [searchOptions, setSearchOptions] = useState<GlobaSearchDetails[]>([]);
  const [classesList, setClassesList] = useState<MappedClass[]>([]);
  const [studentslist, setStudentslist] = useState<Student[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<MappedSchool | null>(
    null
  );
  const [selectedClass, setSelectedClass] = useState<MappedClass | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedSearchOption, setSelectedSearchOption] =
    useState<GlobaSearchDetails | null>(null);
  const [cardDetails, setCardDetails] = useState<CardDetails | null>(null);

  const toggleAutocomplete = () => {
    setShowAutocomplete(!showAutocomplete);
    setSelectedSchool(null);
    setSelectedClass(null);
    setSelectedStudent(null);
    setSearchBarValue("");
    setSelectedSearchOption(null);
    setCardDetails(null);
  };

  const getSearchResultsDelayed = useCallback(
    debounce(
      (query: string, callback: (options: GlobaSearchDetails[]) => void) => {
        setSearchOptions([]);
        const options = searchData(query);
        callback(options);
      },
      200
    ),
    []
  );

  useEffect(() => {
    if (searchBarValue.length >= 3) {
      getSearchResultsDelayed(
        searchBarValue,
        (options: GlobaSearchDetails[]) => {
          setSearchOptions(options);

          const option = options.find((opt) => opt.category === searchBarValue);
          if (option) {
            setSelectedSearchOption(option);
          }
        }
      );
    } else if (searchBarValue === "") {
      setSearchOptions([]);
      setSelectedSearchOption(null);
    }
  }, [searchBarValue, getSearchResultsDelayed]);

  useEffect(() => {
    if (selectedSearchOption) {
      const details = mapGlobalSearchCardDetails(selectedSearchOption);
      setCardDetails(details);
    }
  }, [selectedSearchOption]);

  const handleSchoolChange = (school: string) => {
    setSelectedClass(null);
    setSelectedStudent(null);
    setClassesList([]);

    if (school === "") {
      setSelectedSchool(null);
      return;
    }

    const schoolObj = schoolslist.find((s) => s.schoolName === school);
    if (schoolObj) {
      setSelectedSchool(schoolObj);
    }

    const classes = getClasses(school);
    setClassesList(classes);
  };

  const handleClassChange = (className: string) => {
    setSelectedStudent(null);
    setStudentslist([]);

    if (className === "") {
      setSelectedClass(null);
      return;
    }

    const classObj = classesList.find((cls) => cls.className === className);
    if (classObj) {
      setSelectedClass(classObj);
    }

    const students = getStudents(selectedSchool?.schoolName, className);
    if (students) {
      setStudentslist(students);
    }
  };

  return (
    <div className={styles.bodySection}>
      <div>
        <div className={styles.globalSearch}>
          {!showAutocomplete ? (
            <div className={styles.searchBar}>
              <Autocomplete
                options={searchOptions}
                value={searchBarValue}
                filterOptions={(x) => x}
                openOnFocus
                autoComplete
                includeInputInList
                onInputChange={(_, newValue) => setSearchBarValue(newValue)}
                getOptionLabel={(option) =>
                  option?.category ? option.category : searchBarValue
                }
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <div className={styles.searchOption}>
                      <div
                        className={styles.searchCategory}
                      >{`${option.categoryType}: ${option.category}`}</div>
                      <div className={styles.searchHeirarchy}>
                        {option.heirarchy}
                      </div>
                    </div>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id="input-with-icon-textfield"
                    label="Search by Schools, Classes, Teachers, Students"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <SearchIcon />,
                    }}
                    variant="standard"
                  />
                )}
              />
            </div>
          ) : (
            <h2 className={styles.sectionHeading}>Advanced Search</h2>
          )}
          <div className={styles.filterSearch} onClick={toggleAutocomplete}>
            <Tooltip title="Advance Search">
              <FilterAltIcon />
            </Tooltip>
          </div>
        </div>
      </div>
      {showAutocomplete && (
        <div>
          <div className={styles.searchBoxes}>
            <Autocomplete
              options={schoolslist}
              value={selectedSchool}
              filterOptions={(x) => x}
              getOptionLabel={(option) =>
                option?.schoolName
                  ? option.schoolName
                  : selectedSchool?.schoolName
              }
              onInputChange={(_, newValue) => handleSchoolChange(newValue)}
              renderInput={(params) => <TextField {...params} label="School" />}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {option.schoolName}
                </Box>
              )}
            />
            <Autocomplete
              options={classesList}
              value={selectedClass}
              filterOptions={(x) => x}
              getOptionLabel={(option) =>
                option?.className ? option.className : selectedClass?.className
              }
              onInputChange={(_, newValue) => handleClassChange(newValue)}
              renderInput={(params) => <TextField {...params} label="Class" />}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {option.className}
                </Box>
              )}
            />
            <Autocomplete
              options={studentslist}
              value={selectedStudent}
              filterOptions={(x) => x}
              getOptionLabel={(option) =>
                option?.firstName
                  ? `${option.firstName} ${option.lastName}`
                  : `${selectedStudent?.firstName} ${selectedStudent?.lastName}`
              }
              onInputChange={(_, newValue) => {
                if (newValue) {
                  const studObj = studentslist.find(
                    (s) => newValue === `${s.firstName} ${s.lastName}`
                  );
                  if (studObj) {
                    setSelectedStudent(studObj);
                  }
                } else {
                  setSelectedStudent(null);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Student" />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {`${option.firstName} ${option.lastName}`}
                </Box>
              )}
            />
            <div className={styles.searchButton}>
              <Button
                variant="contained"
                className={styles.applyBtn}
                disabled={!selectedSchool && !selectedStudent && !selectedClass}
                onClick={() => {
                  const details = mapAdvanceSearchCardDetails({
                    selectedSchool,
                    selectedClass,
                    selectedStudent,
                  });
                  setCardDetails(details);
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      {cardDetails && (
        <div className={styles.cardDetailsContainer}>
          <SchoolCard cardDetails={cardDetails} />
        </div>
      )}
    </div>
  );
}

export default Body;
