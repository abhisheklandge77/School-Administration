import styles from "./SchoolCard.module.scss";
import schoolIcon from "../assets/school.svg";
import classIcon from "../assets/classroom.svg";
import teacherIcon from "../assets/teacher.svg";
import studentIcon from "../assets/student.svg";
import { CardDetails } from "../types";

interface SchoolCardProps {
  cardDetails: CardDetails;
}

function SchoolCard(props: SchoolCardProps) {
  const { cardDetails } = props;

  const iconMapper = {
    School: schoolIcon,
    Class: classIcon,
    Teacher: teacherIcon,
    Student: studentIcon,
  };

  const renderCardBody = (type: string) => {
    switch (type) {
      case "School":
        return renderSchoolInfo();

      case "Class":
        return renderClassInfo();

      case "Teacher":
        return renderTeacherInfo();

      case "Student":
        return renderStudentInfo();

      default:
        return "Unknown";
    }
  };

  const renderSchoolInfo = () => {
    return (
      <>
        <div className={styles.field}>
          <span className={styles.cardLabel}>Name: </span>
          <span>{cardDetails.name}</span>
        </div>
        <address className={`${styles.field} ${styles.addressField}`}>
          <span className={styles.cardLabel}>Address: </span>
          <span>{cardDetails.location}</span>
        </address>
        <div className={styles.field}>
          <span className={styles.cardLabel}>No. of Classes: </span>
          <span>{cardDetails.classCount}</span>
        </div>
      </>
    );
  };
  const renderClassInfo = () => {
    return (
      <>
        <div className={styles.field}>
          <span className={styles.cardLabel}>Name: </span>
          <span>{cardDetails.name}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.cardLabel}>School: </span>
          <span>{cardDetails.schoolName}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.cardLabel}>Teacher: </span>
          <span>{cardDetails.teacher}</span>
        </div>
      </>
    );
  };
  const renderTeacherInfo = () => {
    return (
      <>
        <div className={styles.field}>
          <span className={styles.cardLabel}>Name: </span>
          <span>{cardDetails.name}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.cardLabel}>School: </span>
          <span>{cardDetails.schoolName}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.cardLabel}>Class: </span>
          <span>{cardDetails.className}</span>
        </div>
      </>
    );
  };
  const renderStudentInfo = () => {
    return (
      <>
        <div className={styles.field}>
          <span className={styles.cardLabel}>Name: </span>
          <span>{cardDetails.name}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.cardLabel}>School: </span>
          <span>{cardDetails.schoolName}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.cardLabel}>Class: </span>
          <span>{cardDetails.className}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.cardLabel}>Age: </span>
          <span>{cardDetails.age}</span>
        </div>
      </>
    );
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader}>{cardDetails.categoryType}</div>
      <div className={styles.cardInfoWrapper}>
        <div className={styles.cardInfo}>
          {renderCardBody(cardDetails.categoryType)}
        </div>
        <div className={styles.cardImage}>
          <img
            src={iconMapper[`${cardDetails.categoryType}`]}
            alt={cardDetails.categoryType}
          />
        </div>
      </div>
    </div>
  );
}

export default SchoolCard;
