/** @jsxImportSource theme-ui */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
    IArticle,
    IMainItem,
} from '../../../../mock/api/dataModels.ts/features'
import { DataListApi } from '../../../../mock/api/dataModels.ts/root'
import Col from '../../../../shared/components/grid/Col'
import ColumnTop from '../../../../shared/components/grid/ColumnTop'
import Container from '../../../../shared/components/grid/Container'
import Divider from '../../../../shared/components/grid/Divider'
import HeadingContainer from '../../../../shared/components/grid/HeadingContainer'
import InterSection from '../../../../shared/components/grid/InterSection'
import RowFrame from '../../../../shared/components/grid/RowFrame'
import SectionWrapper from '../../../../shared/components/sectionWrapper/SectionWrapper'
import { buildDataset } from '../../../../shared/helpers/sectionHelper'
import { useAnimatedText } from '../../../../shared/hooks/useAnimatedText'
import { useText } from '../../../../shared/hooks/useText'
import { useAppContext } from '../../../../utils/contexts/AppContext'
import CarCost from './CarCost'
import CarFeatures from './CarFeatures'
import CarImage from './CarImage'
import CarBackgroundImage from './old/CarBackgroundImage'

export interface ICarsSectionProps {
    id: number
}
const CarsSection = ({ id }: ICarsSectionProps): React.JSX.Element => {
    const { t } = useTranslation()
    const { getGlobalProperties } = useAppContext()
    const { isMobile } = getGlobalProperties()

    const [cars] = useState<DataListApi<IMainItem>>(
        buildDataset('cars', 'sections', 'list', t)
    )

    const { Title, Icon } = useAnimatedText()
    const { StandardParagraph, DescriptionParagraph } = useText()

    return (
        <SectionWrapper
            id={id}
            name={'cars'}
            sxFrame={{
                // padding: 0,
                background: 'darkerBackground',
            }}
        >
            <InterSection height={'50px'} background={'darkBackground'} />
            <Divider
                type="triangle"
                position={'top'}
                divPosition="relative"
                variant={'bottom'}
                color="darkBackground"
                offsetV={['0px', '0px', '0px', '0px', '0px', '0px']}
            />

            <HeadingContainer
                id={'carsSection'}
                sxContainerStyle={{
                    height: '100px',
                    background: 'transparent',
                    // marginTop: '0px'
                }}
            >
                {Title(
                    `${cars.data.label}`,
                    cars.data.label,
                    'carVehicleOutline'
                )}
            </HeadingContainer>
            <Container
                options={{
                    direction: 'column',
                }}
            >
                <RowFrame
                    heights={['320px', '400px', '420px']}
                    sxStyle={{
                        background: '',
                    }}
                >
                    <Col
                        span={12}
                        sxStyle={{
                            width: '100%',
                            alignItems: 'flex-start',
                            paddingLeft: [
                                '20px',
                                '20px',
                                '85px',
                                '90px',
                                '110px',
                            ],
                            paddingRight: [
                                '20px',
                                '20px',
                                '30px',
                                '75px',
                                '90px',
                            ],
                        }}
                    >
                        {StandardParagraph('carsSection2Text', cars.data.text)}
                    </Col>
                    <Divider
                        type="basic-triangle"
                        position={'bottom'}
                        variant="bottom"
                        flipH
                        color="sectionBackground1"
                    />
                </RowFrame>
            </Container>
            {/* <Container options={{ direction: "column" }}>
                <Row
                height="150px"
                // sxStyle={{
                //   background: "drawerBackground",
                // }}
                >
                {/* <Divider
                    type="slant"
                    position={"top"}
                    color="sectionBackground1"
                />
                </Row>
            </Container> */}

            {cars?.data?.sections?.map((row: IArticle) => {
                return (
                    <Container
                        key={`cars-${row.id}`}
                        options={{ direction: 'column' }}
                    >
                        <HeadingContainer id={'services-title'}>
                            {Title(
                                `${'vehicle'}${row.list[2].label}${
                                    row.list[2].value
                                }`,
                                `${t(row.title)}`,
                                'arrowRightOutline'
                            )}
                        </HeadingContainer>

                        {/** DESCRIPTION */}
                        <RowFrame
                            heights={[
                                '600px',
                                '600px',
                                '400px',
                                '350px',
                                '450px',
                                '500px',
                            ]}
                            sxStyle={{
                                overflow: 'hidden',
                                //background: ['yellow', 'green', 'red', 'beige', 'blue', 'vermillon'],
                                //    position:'absolute',
                                // top: isMobile ? "80px" : isTablet ? "90px" : "70px",
                                // bottom: isMobile ? "80px" : isTablet ? "50px" : "60px"
                                flexDirection: 'column',
                            }}
                        >
                            <Divider
                                type="slant"
                                position={'top'}
                                divPosition="absolute"
                                color="sectionBackground1"
                                variant="top"
                            />

                            <CarBackgroundImage
                                id={`car-background-image-${row.id}`}
                                img={row.img}
                            />

                            <RowFrame
                                sxStyle={{
                                    height: '100%',
                                    flexDirection: isMobile ? 'column' : 'row',
                                }}
                            >
                                <ColumnTop span={isMobile ? 12 : 11}>
                                    <CarCost
                                        id={`row-cost-${row.img}-${row.id}`}
                                        cost={`${row.list[2].value}`}
                                        sxSlideBoxStyle={
                                            {
                                                // marginTop: ['-30px', '-30px', '-20px', '-10px', '-20px', '0px'],
                                                //left: ['-30px', '-30px', '-20px', '-10px', '-40px', '0px']
                                            }
                                        }
                                    />

                                    <CarImage
                                        id={`row-image-${row.img}-${row.id}`}
                                        img={row.img}
                                        sxStyle={
                                            {
                                                // marginTop: isMobile ? '40px' : '0px',
                                                // paddingLeft: ['20px'],
                                                // paddingRight: ['20px'],
                                            }
                                        }
                                    />

                                    <CarFeatures
                                        framWidth={[
                                            '70px',
                                            '80px',
                                            '90px',
                                            '100px',
                                            '70px',
                                            '70px',
                                        ]}
                                        id={row.id}
                                        row={row}
                                        sxSlideBoxStyle={{
                                            top: 'unset',
                                            height: '90px',
                                            left: [
                                                '-70px',
                                                '-100px',
                                                '-20px',
                                                '-80px',
                                                '-90px',
                                                '-130px',
                                            ],
                                            bottom: [
                                                '-30px',
                                                '-20px',
                                                '10px',
                                                '30px',
                                                '40px',
                                                '80px',
                                            ],
                                        }}
                                    />
                                </ColumnTop>

                                <ColumnTop
                                    span={isMobile ? 12 : 11}
                                    sxStyle={{
                                        height: '100%',
                                        marginTop: isMobile ? '-20px' : '0px',
                                    }}
                                >
                                    {DescriptionParagraph(
                                        'social.data.text',
                                        t(row.text),
                                        [
                                            '0px',
                                            '0px',
                                            '0px',
                                            '0px',
                                            '0px',
                                            '0px',
                                        ]
                                    )}
                                </ColumnTop>
                            </RowFrame>
                            <Divider
                                type="slant"
                                position={'bottom'}
                                divPosition="absolute"
                                color="sectionBackground1"
                                variant="bottom"
                            />
                        </RowFrame>
                    </Container>
                )
            })}

            {/* <BackgroundImage
                srcImage={autumnRoad}
                sxFrameStyle={{
                    opacity: 0,
                    mixBlendMode: 'lighten',
                }}
                sxImgStyle={{
                    top: 0,
                    justifyContent: 'left',
                    // padding: '20px',
                    height: '100%',
                    marginTop: !isMobile ? '0' : '-200px',
                    marginLeft: !isMobile ? '-500px' : '',
                }}
            /> */}
        </SectionWrapper>
    )
}

export default CarsSection
