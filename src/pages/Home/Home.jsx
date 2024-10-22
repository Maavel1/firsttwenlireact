import { ReactTyped } from "react-typed";
import AnimationGrah from "../../UI/AnimationGrah/AnimationGrah";
import LinkNavigation from "../../UI/LinkNavigation/LinkNavigation";
import classes from "./home.module.scss";

export default function Home() {
  return (
    <>
      <div className={classes.mainRows}>
        <div className={classes.TextMain}>
          <h1>
            Отличное решение для вашего{" "}
            <ReactTyped
              className={classes.ActiveText}
              strings={["бизнеса", "успеха", "развития", "проекта"]}
              typeSpeed={50}
              backSpeed={30}
              loop
            />
          </h1>
          <p>
            Наша команда готова воплатить в жизнь ваши идей и предложить
            качественное решение для вашего бизнеса
          </p>
          <LinkNavigation to="/service">Мне нужен сайт</LinkNavigation>
        </div>
        <AnimationGrah />
      </div>
    </>
  );
}
