import {linkStyles} from "~/styles/ui-classes";
import {Link} from "react-router";

export default function QuickLink ({href, name, external = false}) {
    return <Link className={linkStyles.join(' ')} to={href} target={external ? '_blank' : '_self'}
                 rel='noreferrer'>{name === undefined ? href : name}</Link>
}
