describe("Blog app", () => {
  beforeEach(() => {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "test_name",
      username: "test_username",
      password: "test_password",
    };
    cy.request("POST", "http://localhost:3003/api/users/", user);
    cy.visit("http://localhost:5173");
  });

  it("Login form is shown", () => {
    cy.get("input#username").should("be.visible");
  });

  describe("Login", () => {
    it("succeeds with correct credentials", () => {
      cy.get("input#username").type("test_username");
      cy.get("input#password").type("test_password");
      cy.contains("login").click();
      cy.contains("test_name logged in");
    });

    it("fails with wrong credentials", () => {
      cy.get("input#username").type("test_username");
      cy.get("input#password").type("wrong");
      cy.contains("login").click();
      cy.get(".error").should("be.visible");
      cy.contains("login");
    });
  });

  describe("When logged in", () => {
    beforeEach(() => {
      cy.login({ username: "test_username", password: "test_password" });
    });

    it("A blog can be created", () => {
      cy.contains("create new blog").click();
      cy.get("input#title").type("test_title");
      cy.get("input#author").type("test_author");
      cy.get("input#url").type("test_url");
      cy.get('button[type="submit"]').click();
      cy.get("html").should("contain", "test_title test_author");
      cy.get(".message").should("be.visible");
    });

    describe("and when there is a blog", () => {
      beforeEach(() => {
        cy.addBlog({
          title: "test_title",
          author: "test_author",
          url: "test_url",
        });
      });
      it("user can like a blog", () => {
        cy.contains("view").click();
        cy.get(".like-button").click();
        cy.get(".like-count").should("have.text", "likes 1");
      });
      it("user who created a blog can delete it", () => {
        cy.contains("view").click();
        cy.get(".remove-button").click();
        cy.get("html").should("not.contain", "test_title test_author");
      });
      it("only the creator can see the delete button of a blog", () => {
        const otherUser = {
          name: "test_name2",
          username: "test_username2",
          password: "test_password2",
        };
        cy.request("POST", "http://localhost:3003/api/users/", otherUser);
        cy.visit("http://localhost:5173");
        cy.login({
          username: otherUser.username,
          password: otherUser.password,
        });

        cy.contains("view").click();
        cy.get(".remove-button").should("not.exist");
      });
    });
    describe("when there are more than one blog", () => {
      beforeEach(() => {
        const firstBlog = {
          title: "test_title1",
          author: "test_author1",
          url: "test_url1",
        };
        const secondBlog = {
          title: "test_title2",
          author: "test_author2",
          url: "test_url2",
        };
        cy.addBlog(firstBlog);
        cy.addBlog(secondBlog);
      });
      it("blogs are ordered according to likes with the blog with the most likes being first", () => {
        cy.contains("test_title1 test_author1").parent().as("firstBlog");
        cy.contains("test_title2 test_author2").parent().as("secondBlog");

        cy.get("@secondBlog").find(".view-button").click();
        cy.get("@secondBlog").find(".like-button").click();

        cy.get("@secondBlog").contains("likes 1");
        cy.get('.blog').eq(0).should('contain', 'test_title2 test_author2');

        cy.get("@firstBlog").find(".view-button").click();
        cy.get("@firstBlog").find(".like-button").click();

        cy.get("@firstBlog").contains("likes 1");
        cy.get("@firstBlog").find(".like-button").click();

        cy.get("@firstBlog").contains("likes 1");
        cy.get('.blog').eq(0).should('contain', 'test_title1 test_author1');
      });
    });
  });
});
