import MainHeading from "~/components/MainHeading";
import SubHeading from "~/components/SubHeading";
import Breadcrumbs from "~/components/Breadcrumbs";
import Address from "~/components/Address";
import DirectionsButton from "~/components/DirectionsButton";
import {linkStyles} from "~/styles/ui-classes";
import {BrandName, buildMeta, DeveloperEmail} from "~/constants/MetaData";
import {Link} from "react-router";

export function meta({}) {
    return buildMeta({
        title: 'Contact us',
        description: `Contact us for any questions or comments about the ${BrandName}.`
    })
}

export default function _frontContactUs() {
    const hyndburnLink = 'https://maps.app.goo.gl/EwvviMzKi7HQpyom6'

    return (
        <>
            <Breadcrumbs
                items={
                    [
                        {name: 'Contact us'}
                    ]
                }
            />

            <MainHeading name='Contact us'/>

            <div className='sm:flex gap-16'>
                <div className='flex-1'>

                    <div className='my-6'>
                        <SubHeading name='Address'/>
                        <Address/>
                    </div>
                    <div className='my-6'>
                        <SubHeading name='Directions'/>

                        <DirectionsButton url={hyndburnLink}/>
                    </div>
                </div>
                <div className='flex-1'>
                    <div className='pb-12 mb-12 border-b border-stone-300 border-dashed'>
                        <SubHeading name='League Secretary'/>
                        <h3 className=''>David Heys - 01254 608565</h3>

                    </div>

                    <SubHeading name='Website Maintainer'/>
                    <p>Always open to ideas and criticism of the website so please provide any feedback to <Link
                        className={linkStyles.join(' ')} to={`mailto:${DeveloperEmail}`}>{DeveloperEmail}</Link>.</p>
                </div>
            </div>
        </>
    )
}