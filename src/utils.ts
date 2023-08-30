import data from "./data/db.json";
import {
  AdvanceSearchDetails,
  CardDetails,
  Class,
  FlattenData,
  GlobaSearchDetails,
  MappedClass,
  SchoolDetails,
  Student,
} from "./types";

function flatten(data: SchoolDetails) {
  var result: any = {};
  function recurse(cur: any, prop: any) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (var i = 0, l = cur.length; i < l; i++)
        recurse(cur[i], prop + "[" + i + "]");
      if (l == 0) result[prop] = [];
    } else {
      var isEmpty = true;
      for (var p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + "." + p : p);
      }
      if (isEmpty && prop) result[prop] = {};
    }
  }
  recurse(data, "");
  return result;
}

const updateFlattenData = (studData: FlattenData) => {
  const newFlattenData: FlattenData = {};

  for (let key in studData) {
    let newKey = key.replace(/]/g, "").replace(/\[/g, ".");

    const flattenKeys = newKey.split(".");

    if (flattenKeys[flattenKeys.length - 1] === "firstName") {
      newKey = newKey.replace("firstName", "studentName");

      const schoolIndex = Number(flattenKeys[1]);
      const classIndex = Number(flattenKeys[3]);
      const studentIndex = Number(flattenKeys[5]);
      const { firstName, lastName } =
        data.schools[schoolIndex].classes[classIndex].students[studentIndex];
      newFlattenData[newKey] = `${firstName} ${lastName}`;
    } else if (
      flattenKeys[flattenKeys.length - 1] === "lastName" ||
      flattenKeys[flattenKeys.length - 1] === "location" ||
      flattenKeys[flattenKeys.length - 1] === "age"
    ) {
      continue;
    } else {
      newFlattenData[newKey] = studData[key];
    }
  }

  return newFlattenData;
};

const flattenData = updateFlattenData(flatten(data));

export const searchData = (searchStr: string) => {
  const matchKeys: string[] = [];

  for (let key in flattenData) {
    if (typeof flattenData[key] === "string") {
      if (flattenData[key].toLowerCase().includes(searchStr.toLowerCase())) {
        matchKeys.push(key);
      }
    }
  }

  const matchResults: GlobaSearchDetails[] = [];

  matchKeys.forEach((matchStr: string) => {
    const matches = matchStr.split(".");
    const category = matches[matches.length - 3];

    const matchObj = {} as GlobaSearchDetails;

    const schoolIndex = Number(matches[1]);
    const schoolName = data.schools[schoolIndex].schoolName;

    if (category === "schools") {
      matchObj.categoryType = "School";
      matchObj.category = schoolName;
      matchObj.heirarchy = `${schoolName} /`;
    } else if (category === "classes") {
      const classIndex = Number(matches[3]);
      const className = data.schools[schoolIndex].classes[classIndex].name;

      if (matches[matches.length - 1] === "teacher") {
        const teacherName =
          data.schools[schoolIndex].classes[classIndex].teacher;

        matchObj.categoryType = "Teacher";
        matchObj.category = teacherName;
        matchObj.heirarchy = `${schoolName} / ${className} / ${teacherName}`;
      } else {
        matchObj.categoryType = "Class";
        matchObj.category = className;
        matchObj.heirarchy = `${schoolName} / ${className}`;
      }
    } else if (category === "students") {
      const classIndex = Number(matches[3]);
      const className = data.schools[schoolIndex].classes[classIndex].name;
      const studentIndex = Number(matches[5]);
      const { firstName, lastName } =
        data.schools[schoolIndex].classes[classIndex].students[studentIndex];
      const studentName = `${firstName} ${lastName}`;

      matchObj.categoryType = "Student";
      matchObj.category = studentName;
      matchObj.heirarchy = `${schoolName} / ${className} / ${studentName}`;
    }

    matchResults.push(matchObj);
  });

  return matchResults;
};

export const getAllSchools = () => {
  return data.schools.map((school) => {
    return {
      schoolName: school.schoolName,
      location: school.location,
    };
  });
};

export const getClasses = (schoolName: string) => {
  let classes: MappedClass[] = [];

  data.schools.forEach((school) => {
    if (school.schoolName === schoolName) {
      classes = school.classes.map((cls: Class) => {
        return {
          className: cls.name,
          teacher: cls.teacher,
        };
      });
    }
  });

  return classes;
};

export const getStudents = (
  selectedSchool: string | undefined,
  className: string
) => {
  let students: Student[] = [];

  data.schools.forEach((school) => {
    if (school.schoolName === selectedSchool) {
      school.classes.forEach((cls) => {
        if (cls.name === className) {
          students = cls.students;
        }
      });
    }
  });

  return students;
};

export const mapGlobalSearchCardDetails = (details: GlobaSearchDetails) => {
  const { categoryType, category, heirarchy } = details;

  const cardDetails = {} as CardDetails;
  cardDetails.categoryType = categoryType;
  cardDetails.name = category;

  const schoolObj = heirarchy.split("/");
  const schoolName = schoolObj[0].trim();

  if (categoryType === "School") {
    const school = data.schools.find((s) => s.schoolName === category);
    cardDetails.location = school?.location;
    cardDetails.classCount = school?.classes.length;
  } else if (categoryType === "Class") {
    cardDetails.schoolName = schoolName;
    const classes = getClasses(schoolName);
    const classObj = classes.find((cls) => cls.className === category);
    cardDetails.teacher = classObj ? classObj.teacher : "";
  } else if (categoryType === "Teacher") {
    cardDetails.schoolName = schoolName;

    cardDetails.className = schoolObj[1];
  } else if (categoryType === "Student") {
    cardDetails.schoolName = schoolName;

    const className = schoolObj[1].trim();
    cardDetails.className = className;
    const students = getStudents(schoolName, className);
    const studObj = students.find(
      (s) => `${s.firstName} ${s.lastName}` === category
    );
    cardDetails.age = studObj ? studObj.age : NaN;
  }

  return cardDetails;
};

export const mapAdvanceSearchCardDetails = (details: AdvanceSearchDetails) => {
  const { selectedSchool, selectedClass, selectedStudent } = details;

  const cardDetails = {} as CardDetails;

  if (!selectedClass && !selectedStudent) {
    cardDetails.categoryType = "School";
    cardDetails.name = selectedSchool.schoolName;
    cardDetails.location = selectedSchool.location;
    const classes = getClasses(selectedSchool.schoolName);
    cardDetails.classCount = classes.length;
  } else if (!selectedStudent) {
    cardDetails.categoryType = "Class";
    cardDetails.name = selectedClass.className;
    cardDetails.teacher = selectedClass.teacher;
    cardDetails.schoolName = selectedSchool.schoolName;
  } else {
    const { firstName, lastName, age } = selectedStudent;

    cardDetails.categoryType = "Student";
    cardDetails.name = `${firstName} ${lastName}`;
    cardDetails.age = age;
    cardDetails.schoolName = selectedSchool.schoolName;
    cardDetails.className = selectedClass.className;
  }

  return cardDetails;
};

export default flatten;
