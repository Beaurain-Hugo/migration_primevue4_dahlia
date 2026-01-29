<script setup>

</script>

<template>
  <div class="footer">
    <div class="footer-elements">

        <div class="links-footer">

            <img src="/Logo-Dahlia.svg" alt="Logo de la plateforme Dahlia" />

            <div class="links">
                <div class="nav-links">
                    <h4>Navigation</h4>
                    <ul>
                        <li>
                            <p>À propos</p>
                        </li>
                        <li>
                            <p>Webinaires & Tutoriels</p>
                        </li>
                        <li>
                            <p>FAQ</p>
                        </li>
                        <li>
                            <p>Nous contacter</p>
                        </li>
                    </ul>
                </div>
                <div class="nav-links">
                    <h4>Légal</h4>
                    <ul>
                        <li>
                            <p>Mentions légales</p>
                        </li>
                        <li>
                            <p>Politique de Confidentialité</p>
                        </li>
                        <li>
                            <p>Conditions Générales d'Utilisation</p>
                        </li>
                        <li>
                            <p>Conditions Générales de Vente</p>
                        </li>
                    </ul>
                </div>
                <div class="nav-links">
                    <h4>Accessibilité</h4>
                    <ul>
                        <li><p>Déclaration d'accessibilité</p></li>
                    </ul>
                </div>
            </div>

        </div>


        <div class="mentions">
            <p><span class="copyright">© 2024 Dahlia. Tous droits réservés.</span></p>
            <div class="social-links">
                <p class="social-media">
                    <img src="/Icon.svg" alt="Icone Facebook" />
                </p>
                <p class="social-media">
                    <img src="/Icon-1.svg" alt="Icone LinkedIn" />
                </p>
                <p class="social-media">
                    <img src="/Icon-2.svg" alt="Icone Instagram" />
                </p>
            </div>
        </div>

    </div>
    <img src="/decorative-flower.svg" alt="Fleur décorative" style="width: 563px;
    height: 489px; bottom:-80px; left: -179px; position: fixed;"/>
  </div>

</template>

<style scoped lang="scss">
// Variables
$color-dark: #1D1D1D;
$color-white: #FFF;
$color-gray: #ABABAB;
$font-family: Inter;

// Mixins
@mixin flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

@mixin flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

// Styles
.footer {
    bottom: 0;
    width: 100%;
    height: 377px;
    background-color: $color-dark;

    .footer-elements {
        display: flex;
        width: 1280px;
        height: 281px;
        flex-direction: column;
        margin: auto;
        align-items: center;
        gap: 48px;
        padding: 48px 198px;
    }

    .links-footer {
        display: flex;
        height: 160px;
        justify-content: space-between;
        align-items: flex-start;
        flex-shrink: 0;
        align-self: stretch;
        padding-bottom: 15px;

        img {
            width: 234.234px;
            height: 80px;
        }
    }

    .mentions {
        @include flex-between;
        height: 73px;
        flex-shrink: 0;
        align-self: stretch;
        border-top: 1px solid $color-gray;
    }

    .links {
        display: flex;
        width: 800px;
        height: 160px;
        align-items: flex-start;
        gap: 54px;
    }

    .nav-links {
        width: 260px;
        height: 160px;

        h4 {
            color: $color-white;
            font-family: $font-family;
            font-weight: 900;
            font-size: 16px;
            line-height: 24px;
            text-align: left;
        }
    }

    p {
        color: $color-gray;
        font-family: $font-family;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
        text-align: left;
    }

    ul {
        padding: 0;
        margin: 0;
    }

    li {
        list-style: none;
        left: 0px;
    }

    .social-links {
        display: flex;
        width: 144px;
        height: 40px;
        align-items: flex-start;
        gap: 12px;
    }

    .social-media {
        @include flex-center;
        width: 40px;
        height: 40px;
        flex-shrink: 0;

        img {
            width: 20px;
            height: 20px;
        }
    }
}

// Media Queries - Tablet
@media (max-width: 1024px) {
    .footer {
        height: auto;

        .footer-elements {
            width: calc(100% - 40px);
            height: auto;
            padding: 48px 20px;
            gap: 40px;
        }

        .links-footer {
            height: auto;
            flex-direction: column;
            align-items: center;
            gap: 40px;

            img {
                width: 180px;
                height: 60px;
            }
        }

        .links {
            width: 100%;
            height: auto;
            flex-direction: column;
            align-items: center;
            gap: 40px;
        }

        .nav-links {
            width: 192px;
            height: auto;
            text-align: center;
        }
        .mentions {
            padding-left: 20px;
            padding-right: 20px;
        }
    }
}

// Media Queries - Mobile
@media (max-width: 768px) {
    .footer {
        height: auto;

        .footer-elements {
            width: calc(100% - 30px);
            padding: 32px 15px;
            gap: 32px;
        }

        .links-footer {
            height: auto;
            flex-direction: column;
            align-items: center;
            gap: 32px;

            img {
                width: 150px;
                height: 50px;
            }
        }

        .links {
            width: 100%;
            height: auto;
            flex-direction: column;
            align-items: center;
            gap: 32px;
        }

        .nav-links {
            width: 192;
            height: auto;
            text-align: center;

            h4 {
                font-size: 14px;
                line-height: 20px;
            }
        }

        p {
            font-size: 12px;
            line-height: 18px;
        }

        .mentions {
            height: auto;
            flex-direction: column;
            gap: 20px;
            padding-top: 10px;
        }

        .social-links {
            width: 100%;
            justify-content: center;
        }
    }
}
</style>
