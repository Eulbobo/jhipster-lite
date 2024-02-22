package tech.jhipster.lite.generator.server.springboot.apidocumentation.springdocauth0.domain;

import static tech.jhipster.lite.module.infrastructure.secondary.JHipsterModulesAssertions.assertThatModuleWithFiles;

import org.junit.jupiter.api.Test;
import tech.jhipster.lite.TestFileUtils;
import tech.jhipster.lite.UnitTest;
import tech.jhipster.lite.module.domain.JHipsterModule;
import tech.jhipster.lite.module.domain.JHipsterModulesFixture;
import tech.jhipster.lite.module.domain.properties.JHipsterModuleProperties;

@UnitTest
class SpringDocAuth0ModuleFactoryTest {

  private static final SpringDocAuth0ModuleFactory factory = new SpringDocAuth0ModuleFactory();

  @Test
  void shouldBuildModule() {
    JHipsterModuleProperties properties = JHipsterModulesFixture.propertiesBuilder(TestFileUtils.tmpDirForTest())
      .basePackage("com.jhipster.test")
      .put("auth0Domain", "dev-123456.us.auth0.com")
      .put("auth0ClientId", "my-client-id")
      .build();

    JHipsterModule module = factory.buildModule(properties);

    //@formatter:off
    assertThatModuleWithFiles(module)
      .hasFile("src/main/resources/config/application-auth0.yml")
      .containing(
        """
        springdoc:
          swagger-ui:
            oauth:
              scopes:
              - openid
              - profile
              - email
              client-id: my-client-id
              realm: jhipster
          oauth2:
            authorization-url: https://dev-123456.us.auth0.com/authorize?audience=https://dev-123456.us.auth0.com/api/v2/
        """
      );
    //@formatter:on
  }
}
